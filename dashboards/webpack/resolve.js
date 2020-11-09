// @flow
'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		CustomGroup: resolve(src, 'components/molecules/GroupCreatingModal/components/CustomGroup'),
		DiagramWidgetEditForm: resolve(src, 'components/organisms/DiagramWidgetEditForm'),
		src,
		Table: resolve(src, 'components/organisms/Table')
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
