// @flow
import {DEFAULT_FONT, DEFAULT_TOOLTIP_SETTINGS, DISPLAY_MODE, FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {State} from './types';

const userMode: $Shape<State> = {
	displayMode: DISPLAY_MODE.ANY
};

const DEFAULT_STYLE = {
	fontColor: '#323232',
	fontFamily: DEFAULT_FONT,
	fontSize: FONT_SIZE_AUTO_OPTION,
	fontStyle: FONT_STYLES.BOLD
};

const DEFAULT_SUMMARY_SETTINGS = {
	indicator: DEFAULT_STYLE
};

const DEFAULT_SUMMARY_OPTIONS = {
	data: {
		formatter: val => val,
		tooltip: DEFAULT_TOOLTIP_SETTINGS
	},
	style: DEFAULT_STYLE,
	value: '0'
};

export {
	userMode,
	DEFAULT_SUMMARY_SETTINGS,
	DEFAULT_SUMMARY_OPTIONS
};
