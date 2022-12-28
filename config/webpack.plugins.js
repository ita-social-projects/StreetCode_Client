const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        manifest: "./public/manifest.json",
        favicon: "./public/favicon.ico",
        inject: true,
    }),
].filter(Boolean);