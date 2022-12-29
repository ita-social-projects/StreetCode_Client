const path = require('path');

function createWebpackAliases (aliases) {
    const result = {};
    for (const name in aliases) {
        result[name] = path.resolve(__dirname, aliases[name]);
    }
    return result;
}

module.exports = createWebpackAliases;