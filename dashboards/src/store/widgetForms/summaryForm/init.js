// @flow
import {createSummaryDataSet} from './helpers';
import {DEFAULT_COMPARE_PERIOD, DEFAULT_HEADER_SETTINGS, DEFAULT_NAVIGATION_SETTINGS, DEFAULT_TOOLTIP_SETTINGS, DISPLAY_MODE} from 'store/widgets/data/constants';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import {DEFAULT_SUMMARY_SETTINGS} from './constants';
import type {State} from './types';

export const initialState: State = {
	comparePeriod: DEFAULT_COMPARE_PERIOD,
	computedAttrs: [],
	data: [createSummaryDataSet(DEFAULT_DATA_KEY)],
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	indicator: DEFAULT_SUMMARY_SETTINGS.indicator,
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	templateName: '',
	tooltip: DEFAULT_TOOLTIP_SETTINGS
};
