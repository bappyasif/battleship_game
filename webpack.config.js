let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let {CleanWebpackPlugin} = require("clean-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'mainBundled.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module:{
        // rules: [
        //     {
        //         test: /\.css$/i,
        //         use: ['style-loader', 'css-loader']
        //     }
        // ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: 'Battleship Game',
        //     // cleanStaleWebpackAssets: false
        // }),
        // new CleanWebpackPlugin({cleanStaleWebpackAssets: false})
    ]
}