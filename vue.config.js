const webpack = require('webpack')
const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: path.join(__dirname, './public/dll/three.manifest.json')
            }),
            new AddAssetHtmlPlugin([
                {
                    filepath: path.resolve(__dirname, './public/dll/*.js'),
                    // 文件输出目录
                    outputPath: 'dll',
                    // 脚本或链接标记的公共路径
                    publicPath: 'dll'
                }
            ])
        ]
    }
}