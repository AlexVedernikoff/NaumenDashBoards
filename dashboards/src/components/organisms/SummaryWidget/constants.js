// @flow
import type {DefaultSummarySettings} from './types';
import {DEFAULT_TOOLTIP_SETTINGS, FONT_FAMILIES, FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Options} from 'utils/chart/types';

const DEFAULT_STYLE = {
	fontColor: '#323232',
	fontFamily: FONT_FAMILIES[0],
	fontSize: FONT_SIZE_AUTO_OPTION,
	fontStyle: FONT_STYLES.BOLD
};

const DEFAULT_SUMMARY_SETTINGS: DefaultSummarySettings = {
	indicator: DEFAULT_STYLE
};

const DEFAULT_SUMMARY_OPTIONS: Options = {
	data: {
		formatter: val => val,
		tooltip: DEFAULT_TOOLTIP_SETTINGS
	},
	style: DEFAULT_STYLE,
	value: '0'
};

export {
	DEFAULT_SUMMARY_SETTINGS,
	DEFAULT_SUMMARY_OPTIONS
};
