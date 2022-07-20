'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		GroupModal: resolve(src, 'components/organisms/GroupModal'),
		PivotWidget: resolve(src, 'components/organisms/PivotWidget'),
		PivotWidgetForm: resolve(src, 'components/organisms/PivotWidgetForm'),
		Table: resolve(src, 'components/organisms/Table'),
		TableWidgetForm: resolve(src, 'components/organisms/TableWidgetForm'),
		WidgetFormPanel: resolve(src, 'components/organisms/WidgetFormPanel'),
		src
	},
	extensions: ['.js', '.jsx'],
	modules: ['node_modules', 'src']
};
