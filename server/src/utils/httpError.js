class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function badRequest(message, details) {
  return new HttpError(400, message, details);
}

function unauthorized(message = "Unauthorized") {
  return new HttpError(401, message);
}

function forbidden(message = "Forbidden") {
  return new HttpError(403, message);
}

function conflict(message = "Conflict") {
  return new HttpError(409, message);
}

function notFound(message = "Resource not found") {
  return new HttpError(404, message);
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  conflict,
  notFound,
};
