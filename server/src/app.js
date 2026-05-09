const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { env } = require("./config/env");
const { authenticate, authorize } = require("./middleware/auth");
const { errorHandler, notFoundHandler } = require("./middleware/errors");
const { publicRouter } = require("./routes/public");
const { authRouter } = require("./routes/auth");
const { portalRouter } = require("./routes/portal");
const { adminRouter } = require("./routes/admin");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan("combined"));
  app.use(express.json());

  app.use("/api", publicRouter);
  app.use("/api/auth", authenticateOptional, authRouter);
  app.use("/api/portal", authenticate, portalRouter);
  app.use("/api/admin", authenticate, authorize("admin"), adminRouter);

  app.use(express.static(env.CLIENT_DIST_PATH, { extensions: ["html"] }));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(env.CLIENT_DIST_PATH, "index.html"));
  });

  app.use("/api", notFoundHandler);
  app.use(errorHandler);

  return app;
}

function authenticateOptional(req, _res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return next();
  }

  return authenticate(req, _res, next);
}

module.exports = { createApp };
