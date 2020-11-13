// @flow
'use strict';

const Autoprefixer = require('autoprefixer');
const define = require('./define');

module.exports = {
	rules: [
		{
			exclude: /(node_modules|bower_components)/,
			test: /\.jsx?$/,
			use: {
				loader: 'babel-loader'
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
						localIdentName: define.development ? '[path][name]__[local]' : '[hash:base64]',
						sourceMap: define.development
					}
				},
				{
					loader: 'postcss-loader',
					options: {
						plugins: [
							new Autoprefixer({
								browsers: [
									'>1%',
									'last 3 versions',
									'ie > 8'
								]
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
