// @flow
import type {AxisOptions, RechartData} from './types';
import type {AxisWidget} from 'store/widgets/data/types';
import {calculateCategoryWidth, getRechartAxisSetting} from './helpers';
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
			result[key] = rowValueSum !== 0 ? (+value) * 100 / rowValueSum : 0;
		});

		return result;
	});

/**
 * Формирует настройки оси Y для вертикальных графиков
 * @param {AxisWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер
 * @param {Array<string>} labels - список подписей
 * @param {string} axisName - название оси
 * @returns {AxisOptions} - настройки оси Y
 */
const getYAxisCategory = (
	widget: AxisWidget,
	container: HTMLDivElement,
	labels: Array<string> = [],
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

	let {mode, width} = calculateCategoryWidth(labels, settings, maxWidth, height);

	width = width + addPlaceForName;

	return {...settings, axisName, height, mode, width};
};

/**
 * Формирует настройки оси X для вертикальных графиков
 * @param {AxisWidget} widget - виджет
 * @param {string} axisName - название оси
 * @returns {AxisOptions} - настройки оси X
 */
const getXAxisNumber = (
	widget: AxisWidget,
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.indicator);
	return {...settings, axisName};
};

export {
	getXAxisNumber,
	getYAxisCategory,
	normalizeSeries
};
