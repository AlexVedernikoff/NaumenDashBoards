// @flow
'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {development} = require('./define');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: development ? '[id].css' : '[id].[hash].css',
		filename: development ? '[name].css' : '[name].[hash].css'
	}),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Embedded Application'
	})
];

module.exports = plugins;
