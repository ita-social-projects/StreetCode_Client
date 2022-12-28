const createWebpackAliases = require('./webpack.helpers');

module.exports = createWebpackAliases({
    '@': '../src',
    '@app': '../src/app',
    '@assets': '../src/assets',
    '@fonts': '../src/assets/fonts',
    '@features': '../src/features',
    '@api': '../src/app/api',
    '@layout': '../src/app/layout',
    '@common': '../src/app/common',
    '@stores': '../src/app/stores',
});