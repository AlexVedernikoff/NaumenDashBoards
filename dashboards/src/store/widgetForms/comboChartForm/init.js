// @flow
import {createComboDataSet} from './helpers';
import {
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_HEADER_SETTINGS,
	DEFAULT_NAVIGATION_SETTINGS,
	DISPLAY_MODE
} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import type {State} from './types';

export const initialState: State = {
	colorsSettings: DEFAULT_COLORS_SETTINGS,
	computedAttrs: [],
	data: [createComboDataSet(DEFAULT_DATA_KEY)],
	dataLabels: DEFAULT_CHART_SETTINGS.dataLabels,
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	indicator: DEFAULT_CHART_SETTINGS.axis,
	legend: DEFAULT_CHART_SETTINGS.legend,
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	parameter: DEFAULT_CHART_SETTINGS.axis,
	showTotalAmount: false,
	sorting: DEFAULT_AXIS_SORTING_SETTINGS,
	templateName: ''
};
