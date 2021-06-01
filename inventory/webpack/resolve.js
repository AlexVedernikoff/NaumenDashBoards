// @flow
'use strict';

const define = require('./define');
const {resolve} = require('path');

module.exports = {
	alias: {
		'components': resolve(define.src, 'components'),
		'containers': resolve(define.src, 'containers'),
		'helpers': resolve(define.src, 'helpers'),
		'icons': resolve(define.src, 'icons'),
		'store': resolve(define.src, 'store'),
		'styles': resolve(define.src, 'styles'),
		'types': resolve(define.src, 'types'),
		'utils': resolve(define.src, 'utils')
	},
	extensions: ['.js', '.jsx']
};
