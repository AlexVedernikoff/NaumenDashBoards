// @flow
import {FONT_FAMILIES, FONT_STYLES} from 'store/widgets/data/constants';

const START_DEGREE = -90;
const END_DEGREE = 90;

// Радиус спидометра, относительно которого заданы базовые размеры шрифтов
const BASE_RADIUS = 130;

const BASE_BORDER_FONT_SIZE = 18;
const BASE_VALUE_FONT_SIZE = 24;

const TITLE_STYLE = {
	fontColor: '#323232',
	fontFamily: FONT_FAMILIES[0],
	fontSize: 18,
	fontStyle: FONT_STYLES.BOLD,
	show: true
};

const CURVE_HEIGHT = 0.3;

export {
	CURVE_HEIGHT,
	BASE_RADIUS,
	BASE_BORDER_FONT_SIZE,
	BASE_VALUE_FONT_SIZE,
	END_DEGREE,
	START_DEGREE,
	TITLE_STYLE
};
