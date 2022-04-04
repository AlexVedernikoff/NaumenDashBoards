'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ParametersXMLWebpackPlugin = require('parameters-xml-webpack-plugin');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: '[id].[contenthash].css',
		filename: '[name].[contenthash].css'
	}),
	new ParametersXMLWebpackPlugin({
		output: './dist/parameters.xml',
		path: './src/rest/resources/eaWithParamsMeta.xml'
	}),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Embedded Application'
	}),
	new CircularDependencyPlugin()
];

module.exports = plugins;
