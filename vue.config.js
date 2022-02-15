const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('./src')
            }
        }
    }
}