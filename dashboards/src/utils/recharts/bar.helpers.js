// @flow
import type {AxisOptions, RechartData} from './types';
import type {AxisWidget} from 'store/widgets/data/types';
import {calculateCategoryWidth, calculateStringsSize, getNiceScale, getRechartAxisSetting} from './helpers';
import {LEGEND_HEIGHT, XAXIS_MAX_WIDTH} from './constants';
import {LEGEND_POSITIONS} from 'utils/recharts/constants';

/**
 * Нормализация данных для процентных вертикальных графиков
 * @param  {RechartData} data - обработанные данные виджета
 * @returns  {RechartData} - нормализованные данные виджета
 */
const normalizeSeries = (data: RechartData): RechartData =>
	data.map(({name, ...values}) => {
		const result = {name};
		const rowValueSum = Object.values(values).reduce((sum, value) => sum + (+value), 0);

		Object.entries(values).forEach(([key, value]) => {
			result[key] = rowValueSum === 0 ? 0 : (+value) * 100 / rowValueSum;
		});

		return result;
	});

/**
 * Формирует настройки оси Y для вертикальных графиков
 * @param {AxisWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер
 * @param {Array<string>} labels - метки виджета
 * @param {Function} formatter - функция форматирования параметра
 * @param {string} axisName - название оси
 * @returns {AxisOptions} - настройки оси Y
 */
const getYAxisCategory = (
	widget: AxisWidget,
	container: HTMLDivElement,
	labels: string[],
	formatter: (value: string | number) => string,
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.parameter);
	const addPlaceForName = settings.showName ? settings.fontSize * 1.5 : 0;
	const maxWidth = XAXIS_MAX_WIDTH - addPlaceForName;
	let {height} = container.getBoundingClientRect();

	if (widget.legend) {
		const {position} = widget.legend;

		if (position === LEGEND_POSITIONS.top || position === LEGEND_POSITIONS.bottom) {
			height -= LEGEND_HEIGHT;
		}
	}

	const formatLabels = labels.map(formatter);
	let {mode, width} = calculateCategoryWidth(formatLabels, settings, maxWidth, height);

	width = width + addPlaceForName;

	return {...settings, axisName, height, mode, width};
};

/**
 * Формирует настройки оси X для вертикальных графиков
 * @param {AxisWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер
 * @param {Array} subContainers - контейнеры, изменяющие ширину графика
 * @param {string} axisName - название оси
 * @param {boolean} isNormalized - флаг, показывающий нормализованные ли значения у оси
 * @returns {AxisOptions} - настройки оси X
 */
const getXAxisNumber = (
	widget: AxisWidget,
	container: HTMLDivElement,
	subContainers: Array<{width?: number}>,
	axisName: string = '',
	isNormalized: boolean = false
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.indicator);
	const showSubTotalAmount = widget.showSubTotalAmount;
	const {width: containerWidth} = container.getBoundingClientRect();
	const graphWidth = containerWidth - subContainers.reduce((acc, subContainer) => acc + (subContainer.width ?? 0), 0);
	let domain = [0, 1];

	if (!isNormalized) {
		domain = [0, value => {
			let niceScale = getNiceScale(value, showSubTotalAmount);

			if (showSubTotalAmount) {
				// Вычисляем дополнительный отступ чтобы вместить
				// метки с промежуточными итогами
				const diff = niceScale - value;
				const diffWidth = diff * graphWidth / niceScale;
				const labelForSubTotalAmount = '_' + value;
				const {width} = calculateStringsSize(
					[[labelForSubTotalAmount]],
					widget.dataLabels.fontFamily,
					widget.dataLabels.fontSize
				)[0];

				if (diffWidth < width) {
					const bestValue = value + (niceScale / graphWidth * width);

					niceScale = getNiceScale(bestValue, showSubTotalAmount);
				}
			}

			return niceScale;
		}];
	}

	return {...settings, axisName, domain};
};

export {
	getXAxisNumber,
	getYAxisCategory,
	normalizeSeries
};
