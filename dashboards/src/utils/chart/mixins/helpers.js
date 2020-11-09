// @flow
import type {ApexAxisChartSeries} from 'apexcharts';
import type {ApexLegend} from 'utils/chart/types';
import type {AxisIndicator, AxisWidget, ComboWidget, Legend, LegendPosition} from 'store/widgets/data/types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {LEGEND_POSITIONS} from 'utils/chart/constants';
import {META_CLASS_VALUE_SEPARATOR} from 'store/widgets/buildData/constants';
import moment from 'moment';
import {parseMSInterval} from 'store/widgets/helpers';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

/**
 * Возвращает лейбл метакласса, отсекая все лишнее
 * @param {string} value - значение метакласса
 * @returns {string}
 */
const getMetaClassLabel = (value: string): string => value.split(META_CLASS_VALUE_SEPARATOR)[0];

const axisLabelFormatter = (usesMetaClass: boolean) => (value: number | string) => {
	let label = String(value);

	if (usesMetaClass) {
		label = getMetaClassLabel(label);
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

/**
 * Возвращает ширину легенды относительно общей ширины графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @param {LegendPosition} position - позиция легенды
 * @returns {number}
 */
const getLegendWidth = (container: HTMLDivElement, position: LegendPosition): number => {
	const {clientWidth: width} = container;
	const {bottom, top} = LEGEND_POSITIONS;

	return position === bottom || position === top ? width : width * 0.2;
};

/**
 * Форматирует значение легенды
 * @param {Legend} settings - настройки легенды виджета
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @param {boolean} usesMetaClass - сообщает используется ли метакласс
 * @returns {Function}
 */
const legendFormatter = (settings: Legend, container: HTMLDivElement, usesMetaClass: boolean) => (legend: string) => {
	const {fontSize, position, textHandler} = settings;
	const length = Math.round(getLegendWidth(container, position) / fontSize);
	let label = legend ? String(legend) : '';

	if (label) {
		if (usesMetaClass) {
			label = getMetaClassLabel(label);
		}

		if (textHandler === TEXT_HANDLERS.CROP && label.length > length) {
			label = `${label.substr(0, length)}...`;
		}
	}

	return label;
};

/**
 * Возвращает настройки для отображения легенды графика
 * @param {Legend} settings - настройки легенды виджета
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @param {boolean} usesMetaClass - сообщает используется ли метакласс
 * @returns {ApexLegend}
 */
const getLegendOptions = (settings: Legend, container: HTMLDivElement, usesMetaClass: boolean = false): ApexLegend => {
	const {fontFamily, fontSize, position, show} = settings;
	const {bottom, top} = LEGEND_POSITIONS;
	const options = {
		fontFamily,
		fontSize,
		itemMargin: {
			horizontal: 5
		},
		position,
		show,
		showForSingleSeries: true
	};
	let height;

	if (position === bottom || position === top) {
		height = 100;
	}

	return {
		...options,
		formatter: legendFormatter(settings, container, usesMetaClass),
		height,
		width: getLegendWidth(container, position)
	};
};

export {
	axisLabelFormatter,
	getLegendOptions,
	getLegendWidth,
	getMaxValue,
	getMetaClassLabel,
	getNiceScale,
	getXAxisLabels,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
};
