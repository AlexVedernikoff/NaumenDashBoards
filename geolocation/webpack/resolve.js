// @flow
'use strict';

const define = require('./define');
const {resolve} = require('path');

module.exports = {
	alias: {
		'components': resolve(define.src, 'components'),
		'helpers': resolve(define.src, 'helpers'),
		'store': resolve(define.src, 'store'),
		'styles': resolve(define.src, 'styles'),
		'containers': resolve(define.src, 'containers'),
		'types': resolve(define.src, 'types'),
		'icons': resolve(define.src, 'icons'),
		'utils': resolve(define.src, 'utils')
	},
	extensions: ['.js', '.jsx']
};
