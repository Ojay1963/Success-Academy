const { HttpError } = require("../utils/httpError");

function notFoundHandler(_req, res) {
  res.status(404).json({
    ok: false,
    message: "API route not found.",
  });
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      details: error.details || null,
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Something went wrong on the server.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
