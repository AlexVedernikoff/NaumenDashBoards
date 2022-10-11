'use strict';
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const GroovyWebpackPlugin = require('groovy-webpack-plugin');
const ParametersXMLWebpackPlugin = require('parameters-xml-webpack-plugin');

const {license} = require('./define');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: '[id].[contenthash].css',
		filename: '[name].[contenthash].css'
	}),
	new ParametersXMLWebpackPlugin({
		output: './dist/parameters.xml',
		path: './src/rest/resources/eaWithParamsMeta.xml'
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
	}),
	new CircularDependencyPlugin()
];

if (license === 'use') {
	plugins.push(new GroovyWebpackPlugin({
		output: './dist/privateModules.xml',
		paths: ['./rest/src/main/groovy/ru/naumen/modules'],
		recursive: true
	}));
}

module.exports = plugins;
