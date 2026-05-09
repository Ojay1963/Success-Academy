const { env } = require("./src/config/env");
const { createApp } = require("./src/app");

const app = createApp();

if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`Success Academy server listening on http://localhost:${env.PORT}`);
  });
}

module.exports = { app, createApp };
