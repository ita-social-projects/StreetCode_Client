const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
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
        new CopyPlugin({
            patterns: [
                {
                    from: 'public/sitemap.xml',
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: 'public/robots.txt',
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: 'public/env-config.js',
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: 'public/google9bdfd511d53c8fcd.html',
                    to: path.resolve(__dirname, '../dist'),
                },
            ],
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
