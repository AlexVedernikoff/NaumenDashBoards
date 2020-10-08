// @flow
import type {DefaultSummarySettings} from './types';
import {FONT_FAMILIES, FONT_STYLES} from 'store/widgets/data/constants';

const DEFAULT_SUMMARY_SETTINGS: DefaultSummarySettings = {
	indicator: {
		fontColor: '#323232',
		fontFamily: FONT_FAMILIES[0],
		fontSize: 60,
		fontStyle: FONT_STYLES.BOLD
	}
};

export {
	DEFAULT_SUMMARY_SETTINGS
};
