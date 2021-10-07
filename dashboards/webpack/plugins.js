'use strict';
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const {development, license} = require('./define');
const Dotenv = require('dotenv-webpack');
const GroovyWebpackPlugin = require('groovy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {IgnorePlugin} = require('webpack');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packagejson = require('../package.json');
const ParametersXMLWebpackPlugin = require('parameters-xml-webpack-plugin');

const devPlugins = [
	new BundleStatsWebpackPlugin({
		outDir: '..',
		silent: true
	}),
	new CircularDependencyPlugin()
];

const prodPlugins = [
	new ParametersXMLWebpackPlugin({
		output: './dist/parameters.xml',
		path: 'metainfo.xml'
	})
];

const plugins = [
	...(development ? devPlugins : prodPlugins),
	new IgnorePlugin(/^\.\/locale$/, /moment$/),
	new MiniCssExtractPlugin({
		chunkFilename: development ? '[id].css' : '[id].[hash].css',
		filename: development ? '[name].css' : '[name].[hash].css'
	}),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Embedded Application'
	}),
	new Dotenv()
];

if (license === 'use') {
	const packageReplacer = {};

	packageReplacer.search = `package ru.naumen.modules.${packagejson.name}`;
	packageReplacer.replacer = packageReplacer.search;
	packageReplacer.replacer += '_v';
	packageReplacer.replacer += packagejson.version.split('.').join('_').split('-')[0].toString();

	plugins.push(new GroovyWebpackPlugin({
		editBySuperusers: false,
		output: './dist/privateModules.xml',
		paths: ['./rest/src/main/groovy/ru/naumen/modules/dashboards'],
		replacers: [packageReplacer]
	}));
}

module.exports = plugins;
