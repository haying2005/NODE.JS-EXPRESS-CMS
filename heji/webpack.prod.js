const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js', //懒加载的模块会生成单独的chunk
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },

    //devtool: 'eval-source-map',   //生产环境不要使用 打包后文件体积会很大
    devServer: {
        //contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin(),  //压缩js

        new CleanWebpackPlugin('dist/*.*', {  //build前先清空dist文件夹
            root: __dirname,
            verbose: true,
            dry: false
        }),

        new webpack.DefinePlugin({
            __HTTP_PREFIX__: JSON.stringify(''),
        })
    ],
}

);