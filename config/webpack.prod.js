const Dotenv = require('dotenv-webpack');
module.exports = {
    entry: {
        main: './src/index.tsx',
    },
    devServer: {
        open: true,
        port: "3000",
        historyApiFallback: true,
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
    },
    plugins: [
        ...require('./webpack.plugins'),
        new Dotenv(),
      ],
}