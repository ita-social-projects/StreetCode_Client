const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      }),
    new HtmlWebpackPlugin({
        template: './public/index.html',
        manifest: "./public/manifest.json",
        favicon: "./public/favicon.ico",
        inject: true,
    }),
].filter(Boolean);