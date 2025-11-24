import { literal, Model } from 'sequelize';

Model.selectQuery = function selectQuery(options) {
  options.model = this;
  if (options.include) {
    // eslint-disable-next-line no-underscore-dangle
    options.include = Model._validateIncludedElements(options).include;
  }
  const query = this.sequelize.dialect.queryGenerator.selectQuery(this.tableName, options, this).replace(/;$/, '');
  if (options.literal) {
    return literal(`(${query})`);
  }
  return query;
};
