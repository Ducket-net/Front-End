// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@tetreum/shroom': path.resolve(__dirname, './lib/shroom/'), // Note the added /src
      },
    },
  },
});
