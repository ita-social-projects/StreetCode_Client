module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.tsx',
    },
    devtool: 'cheap-module-source-map',
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
        publicPath: '/'
    },
    plugins: require('./webpack.plugins'),
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    performance: {
        hints: false,
    },
}