// @flow
import type {ApexAxisChartSeries} from 'apexcharts';
import type {AxisIndicator, AxisWidget, ComboWidget} from 'store/widgets/data/types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {META_CLASS_NAME_DIVIDER} from 'utils/chart/constants';
import moment from 'moment';
import {parseMSInterval} from 'store/widgets/helpers';

const axisLabelFormatter = (usesMetaClass: boolean) => (value: number | string) => {
	let label = String(value);

	if (usesMetaClass && label.includes(META_CLASS_NAME_DIVIDER)) {
		label = label.split(META_CLASS_NAME_DIVIDER)[0];
	}

	return label;
};

const valueFormatter = (usesMSInterval: boolean, usesPercent: boolean, showZero: boolean = true) => (value: number) => {
	let formattedValue = value;

	if (usesMSInterval) {
		formattedValue = parseMSInterval(formattedValue);
	} else if (value) {
		if (!Number.isInteger(formattedValue)) {
			formattedValue = parseFloat(formattedValue.toFixed(2));
		}

		if (usesPercent) {
			formattedValue = `${formattedValue}%`;
		}
	}

	if (!showZero && value === 0) {
		formattedValue = '';
	}

	return formattedValue;
};

const getXAxisLabels = (widget: AxisWidget | ComboWidget, labels: Array<string>): Array<string> => {
	const set = getBuildSet(widget);
	const {group} = set;

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return labels.map(str => {
			const dates = str.split('-');
			return `${moment(dates[0], 'DD.MM.YY').format('DD MMMM')} - ${moment(dates[1], 'DD.MM.YY').format('DD MMMM')}`;
		});
	}

	return labels;
};

const getXAxisOptions = (widget: AxisWidget | ComboWidget) => {
	const {parameter} = widget;
	const {name, show, showName} = parameter;

	let options: Object = {
		labels: {
			hideOverlappingLabels: true,
			maxHeight: 100,
			minHeight: 50,
			rotate: -60,
			show,
			trim: true
		},
		title: {
			offsetY: 10
		}
	};

	if (showName) {
		options.title.text = name;
	}

	return options;
};

const getYAxisOptions = (indicator: AxisIndicator) => {
	const {name, show, showName} = indicator;

	const options: Object = {
		decimalsInFloat: 2,
		labels: {
			maxWidth: 140
		},
		show
	};

	if (showName) {
		options.title = {
			offsetX: -5,
			text: name
		};
	}

	return options;
};

/**
 * Округляет число
 * @param {number} value - исходное число
 * @returns {number} - округленное число
 */
const getNiceScale = (value: number) => {
	const exponent = Math.floor(Math.log10(value) - 1);
	const converter = Math.pow(10, exponent);

	return Math.round(value / converter) * converter;
};

/**
 * Возвращает максимальное значений данных
 * @param {ApexAxisChartSeries} series - данные для построения графика
 * @returns {number} - максимальное значение
 */
const getMaxValue = (series: ApexAxisChartSeries) => {
	const values = series
		.map(s => s.data)
		.reduce((all, data) => [...all, ...data], []);

	return Math.max(...values);
};

export {
	axisLabelFormatter,
	getMaxValue,
	getNiceScale,
	getXAxisLabels,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
};
