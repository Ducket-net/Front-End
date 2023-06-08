// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: true,

    // Conditionally configure the 'copy-webpack-plugin'
    chainWebpack: (config) => {
        // if (process.env.NODE_ENV === "development") {
        config.plugins.delete("copy"); // Disable copying files during development
        // }
    },
});
