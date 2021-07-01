// @flow
'use strict';

const {resolve} = require('path');

const environment = process.env.NODE_ENV;
const development = environment === 'development';
const dist = resolve(__dirname, '../dist');
const production = environment === 'production';
const src = resolve(__dirname, '../src');

module.exports = {
	development,
	dist,
	mode: environment,
	production,
	src
};
