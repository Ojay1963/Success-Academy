const { getUserFromToken, requireRole } = require("../services/auth");
const { unauthorized } = require("../utils/httpError");

function extractToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}

function authenticate(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw unauthorized("Authentication token is required.");
    }

    const user = getUserFromToken(token);
    req.auth = { token, user };
    next();
  } catch (error) {
    next(error);
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    try {
      if (!req.auth?.user) {
        throw unauthorized("Authentication token is required.");
      }
      requireRole(req.auth.user, roles);
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  authenticate,
  authorize,
};
