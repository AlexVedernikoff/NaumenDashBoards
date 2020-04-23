// @flow
import type {DefaultSummarySettings} from './types';
import {FONT_FAMILIES} from 'store/widgets/data/constants';

const DEFAULT_SUMMARY_SETTINGS: DefaultSummarySettings = {
	indicator: {
		fontColor: 'black',
		fontFamily: FONT_FAMILIES[0],
		fontSize: 150,
		fontStyle: undefined
	}
};

export {
	DEFAULT_SUMMARY_SETTINGS
};
