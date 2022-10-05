// @flow
import {createPivotDataSet} from './helpers';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import {DEFAULT_HEADER_SETTINGS, DEFAULT_NAVIGATION_SETTINGS, DEFAULT_TOOLTIP_SETTINGS, DISPLAY_MODE} from 'store/widgets/data/constants';
import {DEFAULT_PIVOT_SETTINGS} from './constants';
import type {State} from './types';

export const initialState: State = {
	computedAttrs: [],
	data: [
		createPivotDataSet(DEFAULT_DATA_KEY)
	],
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	indicatorGrouping: null,
	links: [],
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	parametersOrder: [],
	pivot: DEFAULT_PIVOT_SETTINGS,
	showTotalAmount: false,
	showTotalRowAmount: false,
	templateName: '',
	tooltip: DEFAULT_TOOLTIP_SETTINGS
};
