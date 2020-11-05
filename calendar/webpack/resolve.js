// @flow
'use strict';

const {src} = require('./define');

module.exports = {
	alias: {
		src
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
