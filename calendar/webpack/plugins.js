// @flow
'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		title: 'SMP Calendar'
	}),
	new webpack.EnvironmentPlugin(['NODE_ENV', 'API'])
];

module.exports = plugins;
