// @flow
'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		DiagramWidgetEditForm: resolve(src, 'components/organisms/DiagramWidgetEditForm'),
		GroupModal: resolve(src, 'components/organisms/GroupModal'),
		src,
		Table: resolve(src, 'components/organisms/Table')
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
