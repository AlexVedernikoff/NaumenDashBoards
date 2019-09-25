// @flow
'use strict';

const define = require('./define');
const {resolve} = require('path');

module.exports = {
	alias: {
		'components': resolve(define.src, 'components'),
		'containers': resolve(define.src, 'containers'),
		'constants': resolve(define.src, 'constants'),
		'types': resolve(define.src, 'types'),
		'entities': resolve(define.src, 'entities'),
		'helpers': resolve(define.src, 'helpers'),
		'utils': resolve(define.src, 'utils'),
		'images': resolve(define.src, 'images'),
		'store': resolve(define.src, 'store'),
		'styles': resolve(define.src, 'styles'),
		'icons': resolve(define.src, 'icons')
	},
	extensions: ['.js', '.jsx']
};
