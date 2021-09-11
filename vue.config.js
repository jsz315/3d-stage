const webpack = require('webpack')
const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const isDev = process.env.NODE_ENV == "development";
module.exports = {
    publicPath: isDev ? '/' : './',
    lintOnSave: false,
    configureWebpack: {
        devtool: isDev ? "cheap-module-eval-source-map" : "cheap-module-source-map",
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
    },
    devServer: {
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            '/obj': {
                target: `https://jsz315.gitee.io/three-web-app/obj`,
                changeOrigin: true,
                pathRewrite: {
                    '^/obj' : ''
                }
            }
        }
    },
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve("src/global.less")],
        },
    },
    chainWebpack: (config) => {
        // config.externals = cdn.externals;
        config.resolve.alias
            .set("@", path.resolve("src"))
    },
}