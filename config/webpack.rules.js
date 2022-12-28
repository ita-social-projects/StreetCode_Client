module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
            },
        }
    },
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
        ],
    },
    {
        test: /\.s[ac]ss$/i,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
        ],
    },
    {
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|eot|ttf|woff|woff2)$/i,
        type: 'asset',
        generator: {
            filename: 'assets/[hash][ext][query]',
        },
    },
    {
        test: /\.svg$/,
        loader: 'svg-react-loader'
    },
].filter(Boolean);