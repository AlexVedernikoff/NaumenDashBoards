// @flow
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DISPLAY_MODE, FONT_FAMILIES, FONT_STYLES, RANGES_POSITION, RANGES_TYPES, TEXT_HANDLERS} from 'store/widgets/data/constants';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/chart';
import type {State} from './types';

const DEFAULT_SPEEDOMETER_SETTINGS: Object = {
	axis: {
		show: true,
		showName: false
	},
	borders: {
		max: {
			indicator: {
				aggregation: DEFAULT_AGGREGATION.COUNT,
				attribute: null
			},
			isNumber: true,
			value: 100
		},
		min: {
			indicator: {
				aggregation: DEFAULT_AGGREGATION.COUNT,
				attribute: null
			},
			isNumber: true,
			value: 0
		},
		style: {
			fontColor: '#323232',
			fontFamily: FONT_FAMILIES[0],
			fontSize: 18,
			show: false
		}
	},
	indicator: {
		fontColor: '#323232',
		fontFamily: FONT_FAMILIES[0],
		fontSize: 'auto',
		fontStyle: FONT_STYLES.BOLD,
		show: true
	},
	ranges: {
		data: [{
			// использовать шестнадцатеричное представление, т.к. по нему рассчитывается яркость
			color: '#ffffff',
			from: 0,
			to: 100
		}],
		style: {
			displayType: LEGEND_DISPLAY_TYPES.BLOCK,
			fontColor: '#323232',
			fontFamily: FONT_FAMILIES[0],
			fontSize: 16,
			legendPosition: LEGEND_POSITIONS.right,
			position: RANGES_POSITION.CURVE,
			show: false,
			textHandler: TEXT_HANDLERS.CROP
		},
		type: RANGES_TYPES.PERCENT,
		use: false
	}

};

const USER_MODE: $Shape<State> = {
	displayMode: DISPLAY_MODE.ANY
};

export {
	DEFAULT_SPEEDOMETER_SETTINGS,
	USER_MODE
};
