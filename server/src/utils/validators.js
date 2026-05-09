const { badRequest } = require("./httpError");

function isBlank(value) {
  return typeof value !== "string" || value.trim().length === 0;
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requireFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
  });

  if (missing.length) {
    throw badRequest(`Missing required fields: ${missing.join(", ")}`);
  }
}

function ensureEmail(value, fieldName = "email") {
  if (!isEmail(value)) {
    throw badRequest(`Please provide a valid ${fieldName}.`);
  }
}

function ensureOneOf(value, options, fieldName) {
  if (!options.includes(value)) {
    throw badRequest(`Invalid ${fieldName}. Expected one of: ${options.join(", ")}.`);
  }
}

function ensurePositiveNumber(value, fieldName) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue) || numericValue < 0) {
    throw badRequest(`${fieldName} must be a positive number.`);
  }

  return numericValue;
}

function ensureObject(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest(`${fieldName} must be an object.`);
  }
}

function sanitizeString(value) {
  return typeof value === "string" ? value.trim() : value;
}

module.exports = {
  isBlank,
  isEmail,
  requireFields,
  ensureEmail,
  ensureOneOf,
  ensurePositiveNumber,
  ensureObject,
  sanitizeString,
};
