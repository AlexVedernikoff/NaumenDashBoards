'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const GroovyWebpackPlugin = require('groovy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {development, license} = require('./define');

const packagejson = require('../package.json');

const plugins = [
	new MiniCssExtractPlugin({
		chunkFilename: development ? '[id].css' : '[id].[hash].css',
		filename: development ? '[name].css' : '[name].[hash].css'
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
		paths: ['./rest/src/main/groovy/ru/naumen/modules/documentVerify'],
		recursive: true
	}));
}

module.exports = plugins;
