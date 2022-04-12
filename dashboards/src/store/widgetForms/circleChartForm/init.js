// @flow
import {createCircleDataSet} from './helpers';
import {
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_HEADER_SETTINGS,
	DEFAULT_NAVIGATION_SETTINGS,
	DEFAULT_TOOLTIP_SETTINGS,
	DISPLAY_MODE
} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/recharts/constants';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import type {State} from './types';

export const initialState: State = {
	breakdownFormat: null,
	colorsSettings: DEFAULT_COLORS_SETTINGS,
	computedAttrs: [],
	data: [createCircleDataSet(DEFAULT_DATA_KEY)],
	dataLabels: DEFAULT_CHART_SETTINGS.dataLabels,
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	legend: DEFAULT_CHART_SETTINGS.legend,
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	showTotalAmount: false,
	sorting: DEFAULT_AXIS_SORTING_SETTINGS,
	templateName: '',
	tooltip: DEFAULT_TOOLTIP_SETTINGS
};
