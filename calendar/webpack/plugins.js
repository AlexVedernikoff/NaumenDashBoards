// @flow
'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GroovyWebpackPlugin = require('groovy-webpack-plugin');
const define = require('./define');

const {license} = define;

const plugins = [
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Calendar'
	}),
	new webpack.EnvironmentPlugin(['NODE_ENV', 'API', 'LICENSE'])
];

if (license === 'use') {
	plugins.push(new GroovyWebpackPlugin({
		output: './dist/params.xml',
		path: './rest/src/main/groovy/ru/naumen/modules/',
		recursive: true
	}));
}

module.exports = plugins;
