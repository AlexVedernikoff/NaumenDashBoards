// @flow
'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		CustomGroup: resolve(src, 'components/molecules/GroupCreatingModal/components/CustomGroup'),
		src,
		Table: resolve(src, 'components/organisms/Table'),
		WidgetFormPanel: resolve(src, 'components/organisms/WidgetFormPanel')
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
