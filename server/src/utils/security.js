const crypto = require("crypto");
const { env } = require("../config/env");

function hashPassword(password) {
  return crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(password)
    .digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createResetCode() {
  return String(crypto.randomInt(100000, 1000000));
}

module.exports = {
  hashPassword,
  createToken,
  createResetCode,
};
