// @flow
import {BASE_RADIUS, CURVE_HEIGHT, END_DEGREE, START_DEGREE} from './constants';
import type {Range, RangesTypes} from 'store/widgets/data/types';
import {RANGES_TYPES} from 'store/widgets/data/constants';

/**
 * Расчитывает координаты из полярных координат
 * @param {number} centerX - X центр полярных координат
 * @param {number} centerY - Y центр полярных координат
 * @param {number} radius - радиус
 * @param {number} angleInDegrees - угол
 * @returns {object}
 */
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians)
	};
};

/**
 * Преобразует и очищает разряженый массив отрезков в процентные отрезки от 0 до 100
 * @param {Array<Range>} ranges - массив отрезков
 * @param {RangesTypes} type - тип отрезков (процент/абсолютные)
 * @param {number} min - абсолютное знаечение минимума (0 - при проценте)
 * @param {number} max - абсолютное значение максимума (100 - при проценте)
 * @param {string} defaultColor - цвет не указанного отрезка
 * @param {number} formatter - форматтер для текстов
 * @returns {Array<Range>} - полный отсортированый массив отрезков
 */
const normalizingRanges = (ranges: Array<Range>, type: RangesTypes, min: number, max: number, defaultColor: string, formatter: (value: number) => string) => {
	const result = [];
	let prevTo = null;
	let useFormatter = formatter;

	if (type === RANGES_TYPES.PERCENT) {
		const mul = (max - min) / 100;

		useFormatter = (value: number) => formatter(min + mul * value);
	}

	const legendFormatter = (from, to) => `${useFormatter(from)} - ${useFormatter(to)}`;

	ranges.sort(({from: fromA}, {from: fromB}) => parseFloat(fromA) - parseFloat(fromB));

	const rangeMin = type === RANGES_TYPES.PERCENT ? 0 : min;
	const rangeMax = type === RANGES_TYPES.PERCENT ? 100 : max;

	ranges.forEach(({color, from, to}) => {
		let parseFrom = parseFloat(from);
		let parseTo = parseFloat(to);

		if (parseFrom < rangeMin) {
			parseFrom = rangeMin;
		}

		if (parseTo > rangeMax) {
			parseTo = rangeMax;
		}

		if (prevTo && prevTo > parseFrom) {
			parseFrom = prevTo;
		}

		if (parseFrom < parseTo) {
			if (result.length === 0 && parseFrom > rangeMin) {
				result.push({
					color: defaultColor,
					from: rangeMin,
					legendText: legendFormatter(rangeMin, parseFrom),
					text: useFormatter(parseFrom),
					to: parseFrom
				});
			}

			if (prevTo && prevTo !== parseFrom) {
				result.push({
					color: defaultColor,
					from: prevTo,
					legendText: legendFormatter(prevTo, parseFrom),
					text: useFormatter(parseFrom),
					to: parseFrom
				});
			}

			result.push({color, from: parseFrom, legendText: legendFormatter(parseFrom, parseTo), text: useFormatter(parseTo), to: parseTo});
		}

		prevTo = parseTo;
	});

	const from = result?.[result.length - 1]?.to ?? rangeMin;
	const toMax = type === RANGES_TYPES.ABSOLUTE ? max : 100;

	if (from !== toMax) {
		result.push({color: defaultColor, from, legendText: legendFormatter(from, toMax), text: useFormatter(toMax), to: toMax});
	}

	let normalizingResult = result;

	if (type === RANGES_TYPES.ABSOLUTE) {
		const diff = max - min;
		const calcProcent = (value) => (value - min) * 100 / diff;

		normalizingResult = result.map(({from, to, ...data}) => ({from: calcProcent(from), to: calcProcent(to), ...data}));
	}

	return normalizingResult;
};

/**
 * Расчитывает угол по значению
 * @param {number} value - значение, от 0 до 100
 * @returns {number} - значение угла от -90 до 90
 */
const getAngleByValue = (value: number) => {
	const angle = Math.round(180 / 100 * (Number(value))) - 90;
	return Math.min(Math.max(START_DEGREE, angle), END_DEGREE);
};

/**
 * Расчитывает сетку размещения для спидометра (см calcLayout.drawio.svg)
 * @param {number} width - ширина спидометра
 * @param {number} height - высота спидометра
 * @param {number} curveFontSize - размер шрифта на диаграмме
 * @param {number} borderFontSize - размер шрифта для границах
 * @param {number} titleFontSize - размер шрифта для заголовка
 * @returns {object} - сетка размещения спидометра
 */
const calcLayout = (width: number, height: number, curveFontSize: number, borderFontSize: number, titleFontSize: number) => {
	const baseHeight = height > (width / 2) ? width / 2 : height;
	const curveTextOffset = curveFontSize > 0 ? 5 : 0;
	const fontOffset = (curveFontSize + borderFontSize + titleFontSize) / BASE_RADIUS;
	const drawOffset = 1 + CURVE_HEIGHT + fontOffset;
	const radius = (baseHeight - curveTextOffset) / drawOffset;
	const fontSizeScale = radius / BASE_RADIUS;
	const fullHeight = radius * (1 + CURVE_HEIGHT * 2) + (curveFontSize + borderFontSize + titleFontSize) * fontSizeScale;
	const arcX = width / 2;
	const offsetArcY = (height - fullHeight) / 2;
	const arcY = offsetArcY + curveFontSize * fontSizeScale + radius * (1 + CURVE_HEIGHT) + 5;

	return {arcX, arcY, fontSizeScale, radius};
};

export {
	calcLayout,
	getAngleByValue,
	normalizingRanges,
	polarToCartesian
};
