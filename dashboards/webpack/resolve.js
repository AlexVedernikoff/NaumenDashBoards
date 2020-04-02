// @flow
'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		CustomGroup: resolve(src, 'components/molecules/GroupCreatingModal/components/CustomGroup'),
		src
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
