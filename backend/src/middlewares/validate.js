import HttpErrors from 'http-errors';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

const schemas = {};

fs.globSync(path.resolve('./src/schemas/**/*.js')).forEach(async (name) => {
  const key = path
    .relative(`${import.meta.dirname}/../schemas`, name)
    .replace('.js', '')
    .replaceAll('/', '.');
  _.set(schemas, key, await import(name).then((d) => d.default));
});

export const joinedArray = (j) => ({
  base: j.array(),
  coerce: (value, { schema }) => {
    const { args = {} } = schema.$_getRule('separator') || {};
    if (value === '') {
      return [];
    }
    return {
      value: value.split ? value.split(args.separator || ',') : value,
    };
  },
  rules: {
    separator: {
      method(separator) {
        return this.$_addRule({ name: 'separator', args: { separator } });
      },
      validate(value) {
        return value;
      },
    },
  },
  type: 'joinedArray',
});

export const validateMiddleware = (schema = '') => (req, res, next) => {
  try {
    const rules = schema ? _.get(schemas, schema) : {};

    if (!rules) {
      throw HttpErrors(503, `Validation failed. ${schema}`);
    }

    _.map(rules, (rule, key) => {
      const validation = rule.validate(req[key] || {}, {
        abortEarly: false,
      });
      if (validation.error) {
        const errors = {};
        validation.error.details.forEach((err) => {
          _.set(errors, err.context.label, err.message.replace(/^".+?"\s/, 'Field '));
        });
        throw HttpErrors(422, { errors });
      }

      Object.defineProperty(req, key, {
        value: validation.value,
        writable: true,
      });
    });
    next();
  } catch (e) {
    next(e);
  }
};

export default validateMiddleware;
