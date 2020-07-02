// @flow
import {RANGES_TYPES} from 'store/widgets/data/constants';

const DEFAULT_SPEEDOMETER_SETTINGS = {
	borders: {
		max: 100,
		min: 0
	},
	ranges: {
		use: false,
		type: RANGES_TYPES.ABSOLUTE,
		data: [{
			// использовать шестнадцатеричное представление, т.к. по нему рассчитывается яркость
			color: '#ffffff',
			from: 0,
			to: 100
		}]
	}
};

const START_DEGREE = -90;
const END_DEGREE = 90;

// Радиус спидометра, относительно которого заданы базовые размеры шрифтов
const BASE_RADIUS = 130;

const BORDER_FONT_SIZE = 18;
const TITLE_FONT_SIZE = 12;
const VALUE_FONT_SIZE = 24;

const BASE_FONT_SIZES = {
	BORDER_FONT_SIZE,
	TITLE_FONT_SIZE,
	VALUE_FONT_SIZE
};

export {
	BASE_RADIUS,
	BASE_FONT_SIZES,
	DEFAULT_SPEEDOMETER_SETTINGS,
	END_DEGREE,
	START_DEGREE
};
