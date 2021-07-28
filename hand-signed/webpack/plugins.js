// @flow
'use strict';
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ParametersXMLWebpackPlugin = require('parameters-xml-webpack-plugin');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: '[id].css',
		filename: '[name].css'
	}),
	new ParametersXMLWebpackPlugin({
		output: './dist/parameters.xml',
		path: './src/rest/resources/eaWithParamsMeta.xml',
	}),
	new CopyPlugin([
		{
			from: 'static'
		}
	]),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Embedded Application'
	})
];

module.exports = plugins;
