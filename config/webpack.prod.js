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
        filename: '[name].bundle.js',
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
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name of the package
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // exlude @ symbol from package name (cause it may be used by the server)
                        return `npm.${packageName.replace('@', '')}`;
                    }
                },
            },
        },
    },
}
