const createWebpackAliases = require('./webpack.helpers');

module.exports = createWebpackAliases({
    '@': '../src',
    '@app': '../src/app',
    '@assets': '../src/assets',
    '@images': '../src/assets/images',
    '@sass': '../src/assets/sass',
    '@fonts': '../src/assets/fonts',
    '@features': '../src/features',
    '@streetcode': '../src/features/StreetcodePage',
    '@api': '../src/app/api',
    '@layout': '../src/app/layout',
    '@components': '../src/app/common/components',
    '@constants': '../src/app/common/constants',
    '@utils': '../src/app/common/utils',
    '@hooks': '../src/app/common/hooks',
    '@stores': '../src/app/stores',
    '@models': '../src/models',
});