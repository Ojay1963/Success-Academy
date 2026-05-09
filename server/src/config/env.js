const path = require("path");

const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH_SECRET: process.env.AUTH_SECRET || "success-academy-dev-secret-change-me",
  TOKEN_TTL_HOURS: Number(process.env.TOKEN_TTL_HOURS || 12),
  PASSWORD_RESET_TTL_MINUTES: Number(process.env.PASSWORD_RESET_TTL_MINUTES || 15),
  APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:3000",
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || "demo",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || "pk_test_success_academy",
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "pk_test_success_academy",
  CLIENT_DIST_PATH: path.join(__dirname, "..", "..", "..", "client", "dist"),
};

module.exports = { env };
