// @flow
'use strict';

const Autoprefixer = require('autoprefixer');
const define = require('./define');
const path = require('path');

module.exports = {
	rules: [
		{
			exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
			test: /\.(js|jsx)$/,
			use: {
				loader: 'babel-loader',
				options: {
					babelrc: false,
					cacheDirectory: true,
					compact: false,
					configFile: path.resolve(__dirname, '../babel.config.js'),
					sourceMaps: false
				}
			}
		},
		{
			test: /\.(css|less)$/,
			use: [
				{
					loader: 'style-loader',
					options: {
						injectType: 'singletonStyleTag'
					}
				},
				{
					loader: 'css-loader',
					options: {
						localIdentName: define.development
							? '[path][name]__[local]'
							: '[hash:base64]',
						sourceMap: define.development
					}
				},
				{
					loader: 'postcss-loader',
					options: {
						plugins: [
							new Autoprefixer({
								browsers: ['>1%', 'last 3 versions', 'ie > 8']
							})
						],
						sourceMap: define.development
					}
				}
			]
		},
		{
			test: /\.less$/,
			use: {
				loader: 'less-loader',
				options: {
					relativeUrls: true,
					sourceMap: define.development
				}
			}
		},
		{
			test: /\.(gif|png|jpg|jpeg|woff|woff2|ttf|eot|svg)$/,
			type: 'asset/resource'
		}
	]
};
