const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[hash:8].js', //懒加载的模块会生成单独的chunk
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'eval-source-map',
    devServer: {
        //contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },

    plugins: [
        new webpack.DefinePlugin({
            __HTTP_PREFIX__: JSON.stringify('http://localhost:3000'),
        })
    ],
}

);