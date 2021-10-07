// @flow
import {createSpeedometerDataSet} from './helpers';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import {DEFAULT_HEADER_SETTINGS, DEFAULT_NAVIGATION_SETTINGS, DISPLAY_MODE} from 'store/widgets/data/constants';
import {DEFAULT_SPEEDOMETER_SETTINGS} from './constants';
import type {State} from './types';

export const initialState: State = {
	borders: DEFAULT_SPEEDOMETER_SETTINGS.borders,
	computedAttrs: [],
	data: [createSpeedometerDataSet(DEFAULT_DATA_KEY)],
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	indicator: DEFAULT_SPEEDOMETER_SETTINGS.indicator,
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	parameter: DEFAULT_SPEEDOMETER_SETTINGS.axis,
	ranges: DEFAULT_SPEEDOMETER_SETTINGS.ranges,
	templateName: ''
};
