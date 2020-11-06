// @flow
'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: '[id].css',
		filename: '[name].css'
	}),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Calendar'
	}),
	new webpack.EnvironmentPlugin(['NODE_ENV', 'API'])
];

module.exports = plugins;
