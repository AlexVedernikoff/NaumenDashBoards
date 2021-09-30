// @flow
import {createTableDataSet} from './helpers';
import {DEFAULT_DATA_KEY} from 'store/widgetForms/constants';
import {
	DEFAULT_HEADER_SETTINGS,
	DEFAULT_NAVIGATION_SETTINGS,
	DEFAULT_TOP_SETTINGS,
	DISPLAY_MODE
} from 'store/widgets/data/constants';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'Table/constants';
import type {State} from './types';

export const initialState: State = {
	calcTotalColumn: false,
	computedAttrs: [],
	data: [createTableDataSet(DEFAULT_DATA_KEY)],
	displayMode: DISPLAY_MODE.WEB,
	header: DEFAULT_HEADER_SETTINGS,
	name: '',
	navigation: DEFAULT_NAVIGATION_SETTINGS,
	showBlankData: false,
	showEmptyData: false,
	showTotalAmount: false,
	sorting: DEFAULT_TABLE_SORTING,
	table: DEFAULT_TABLE_SETTINGS,
	templateName: '',
	top: DEFAULT_TOP_SETTINGS
};
