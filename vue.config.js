// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // add this section to your config file
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
});
