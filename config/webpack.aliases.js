const createWebpackAliases = require('./webpack.helpers');

module.exports = createWebpackAliases({
    '@': '../src',
    '@app': '../src/app',
    '@assets': '../src/assets',
    '@fonts': '../src/assets/fonts',
    '@sass': '../src/assets/sass',
    '@images': '../src/assets/images',
    '@features': '../src/features',
    '@streetcode': '../src/features/StreetcodePage',
    '@api': '../src/app/api',
    '@layout': '../src/app/layout',
    '@components': '../src/app/common/components',
    '@hooks': '../src/app/common/hooks',
    '@constants': '../src/app/common/constants',
    '@utils': '../src/app/common/utils',
    '@stores': '../src/app/stores',
    '@models': '../src/models',
});