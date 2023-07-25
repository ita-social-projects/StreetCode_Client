const Dotenv = require('dotenv-webpack');
const webpack = require("webpack");
module.exports = {
    entry: {
        main: './src/index.tsx',
    },
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: false,
        alias: require('./webpack.aliases'),
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/',
        clean: true,
    },
    plugins: [
        ...require('./webpack.plugins'),
        new Dotenv({
            path: `./.env`,
        }), 
      ],
}