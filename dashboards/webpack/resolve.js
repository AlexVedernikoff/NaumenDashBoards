// @flow
'use strict';

const {src} = require('./define');
const {resolve} = require('path');

module.exports = {
	alias: {
		'icons': resolve(src, 'icons'),
		'images': resolve(src, 'images'),
		'components': resolve(src, 'components'),
		'containers': resolve(src, 'containers'),
		'src': resolve(src),
		'store': resolve(src, 'store'),
		'styles': resolve(src, 'styles'),
		'utils': resolve(src, 'utils')
	},
	extensions: ['.js', '.jsx']
};
