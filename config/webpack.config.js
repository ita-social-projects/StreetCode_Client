const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, '../src/index.tsx'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@assets': path.resolve(__dirname, '../public/assets'),
            '@fonts': path.resolve(__dirname, '../src/fonts'),
            '@api': path.resolve(__dirname, '../src/app/api'),
            '@common': path.resolve(__dirname, '../src/app/common'),
            '@stores': path.resolve(__dirname, '../src/app/stores'),
            '@features': path.resolve(__dirname, '../src/features'),
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        filename: 'bundle.js',
    },
}