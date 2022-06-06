// @flow
'use strict';

const {resolve} = require('path');

const environment = process.env.NODE_ENV;
const development = environment === 'development';
const dist = resolve(__dirname, '../dist');
const license = process.env.LICENSE;
const production = environment === 'production';
const src = resolve(__dirname, '../src');
const storybook = !!process.env.STORYBOOK;
const isUserModeInclude = process.env.USER_MODE === 'true';
const title = process.env.description ?? 'SMP Embedded Application';

module.exports = {
	development,
	dist,
	isUserModeInclude,
	license,
	mode: environment,
	production,
	src,
	storybook,
	title
};
