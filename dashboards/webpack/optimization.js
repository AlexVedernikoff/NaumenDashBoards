'use strict';

const define = require('./define');
const TerserPlugin = require('terser-webpack-plugin');

const optimization = define.production
	? {
		minimize: true,
		minimizer: [new TerserPlugin()]
	}
	: {};

module.exports = optimization;
