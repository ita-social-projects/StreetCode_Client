const Dotenv = require('dotenv-webpack');

module.exports = env => ({
    mode: 'production',
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
        publicPath: '/'
    },
    plugins: [
        ...require('./webpack.plugins'),
        new Dotenv({
            path: `./.env.production`
        }),
      ],
})