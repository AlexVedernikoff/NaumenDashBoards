// @flow
'use strict';

const define = require('./define');
const {resolve} = require('path');

module.exports = {
	alias: {
		'components': resolve(define.src, 'components'),
		'constants': resolve(define.src, 'constants'),
		'containers': resolve(define.src, 'containers'),
		'entities': resolve(define.src, 'entities'),
		'helpers': resolve(define.src, 'helpers'),
		'icons': resolve(define.src, 'icons'),
		'images': resolve(define.src, 'images'),
		'store': resolve(define.src, 'store'),
		'styles': resolve(define.src, 'styles'),
		'utils': resolve(define.src, 'utils'),
		'types': resolve(define.src, 'types')
	},
	extensions: ['.js', '.jsx', '.less']
};
