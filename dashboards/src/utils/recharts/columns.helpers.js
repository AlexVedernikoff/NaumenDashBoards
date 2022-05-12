// @flow
import type {AxisOptions, RechartData} from './types';
import type {AxisWidget} from 'store/widgets/data/types';
import {calculateCategoryHeight, calculateStringsSize, getRechartAxisSetting} from './helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {LEGEND_HEIGHT, LEGEND_WIDTH_PERCENT} from './constants';
import {LEGEND_POSITIONS} from 'utils/recharts/constants';

/**
 * Нормализация данных для процентных столбовых диаграмм
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

const getYAxisNumber = (
	widget: AxisWidget,
	data: DiagramBuildData,
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.indicator);
	let maxValueLength = 0;

	data.series.forEach(row => {
		const valLengths = row.data.map(val => ('' + val).length);
		const maxRowValueLength = Math.max(...valLengths);

		if (maxRowValueLength > maxValueLength) {
			maxValueLength = maxRowValueLength;
		}
	});

	const maxString = Array(maxValueLength + 1).fill('0').join('');
	const sizes = calculateStringsSize([[maxString], [axisName]], settings.fontFamily, settings.fontSize);
	let width = sizes[0]?.width ?? 0;

	if (settings.showName) {
		width += (sizes[1]?.height ?? 0);
	}

	return {...settings, axisName, width};
};

const getXAxisCategory = (
	widget: AxisWidget,
	container: HTMLDivElement,
	labels: Array<string> = [],
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.parameter);
	const addPlaceForName = settings.showName ? settings.fontSize * 2 : 0;
	const maxHeight = LEGEND_HEIGHT - addPlaceForName;
	let {width} = container.getBoundingClientRect();

	if (widget.legend && widget.legend.show) {
		const {position} = widget.legend;

		if (position === LEGEND_POSITIONS.left || position === LEGEND_POSITIONS.right) {
			width -= width * LEGEND_WIDTH_PERCENT;
		}
	}

	const {height: categoryHeight, labels: multilineLabels, mode} = calculateCategoryHeight(labels, settings, maxHeight, width);
	let height = categoryHeight;

	if (settings.showName) {
		const labels = widget.data.map(dataSet => dataSet.xAxisName);
		const labelSize = calculateStringsSize([labels], settings.fontFamily, settings.fontSize)[0];

		height += labelSize.height;
	}

	return {...settings, axisName, height, mode, multilineLabels, width};
};

export {
	getXAxisCategory,
	getYAxisNumber,
	normalizeSeries
};
