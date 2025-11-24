import HttpError from 'http-errors';

const { NODE_ENV } = process.env;

function translateErrors(t, errors) {
  for (const key in errors) {
    if (!errors[key]) continue;

    if (typeof errors[key] === 'string') {
      errors[key] = t(errors[key]);
    } else if (typeof errors[key] === 'object') {
      errors[key] = translateErrors(t, errors[key]);
    }
  }
  return errors;
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status = +err.status || 500;

  const displayStack = (NODE_ENV !== 'production' && status >= 500);
  res.status(status);
  res.json({
    status: 'error',
    message: err.message,
    errors: err.errors,
    stack: displayStack ? err.stack : undefined,
  });
}

errorHandler.notFound = (req, res, next) => {
  next(HttpError(404));
};
