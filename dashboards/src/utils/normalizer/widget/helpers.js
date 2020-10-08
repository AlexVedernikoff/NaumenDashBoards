// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {AxisIndicator, AxisParameter, ChartSorting, ComputedBreakdown, DataLabels, Header, Legend} from 'store/widgets/data/types';
import {createDefaultGroup, transformGroupFormat} from 'store/widgets/helpers';
import type {CreateFunction, Fields, LegacyWidget} from './types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_AXIS_SORTING_SETTINGS, DEFAULT_CIRCLE_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS, LEGEND_POSITIONS} from 'utils/chart/constants';
import {DEFAULT_HEADER_SETTINGS} from 'components/molecules/Diagram/constants';
import {extend, getMapValues, isObject} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getProcessedValue} from 'store/sources/attributes/helpers';

const mock: Object = Object.freeze({});

/**
 * Возвращает настройки сортировки данных графика
 * @param {object} widget - виджет
 * @param {boolean} circle - сообщает, является ли график круговым
 * @returns {object}
 */
const chartSorting = (widget: Object, circle: boolean = false): ChartSorting => {
	let {sorting = {}} = widget;
	const defaultSettings = circle ? DEFAULT_CIRCLE_SORTING_SETTINGS : DEFAULT_AXIS_SORTING_SETTINGS;

	sorting = {
		...defaultSettings,
		...sorting
	};

	return sorting;
};

/**
 * Преобразует данные к текущему формату настроек отображения оси Y на графике
 * @param {object} widget - виджет
 * @param {Attribute} attribute - атрибут по оси Y
 * @returns {object}
 */
const axisIndicator = (widget: Object, attribute: Attribute): AxisIndicator => {
	const {indicator = {}, showYAxis} = widget;
	const {
		name = getProcessedValue(attribute, 'title'),
		showName = Boolean(showYAxis)
	} = indicator;

	return {
		...DEFAULT_CHART_SETTINGS.yAxis,
		...indicator,
		name,
		showName
	};
};

/**
 * Преобразует данные к текущему формату настроек отображения оси X на графике
 * @param {object} widget - виджет
 * @param {Attribute} attribute - атрибут по оси X
 * @returns {object}
 */
const axisParameter = (widget: Object, attribute: Attribute): AxisParameter => {
	const {parameter = {}, showXAxis} = widget;
	const {
		name = getProcessedValue(attribute, 'title'),
		showName = Boolean(showXAxis)
	} = parameter;

	return {
		...DEFAULT_CHART_SETTINGS.xAxis,
		...parameter,
		name,
		showName
	};
};

/**
 * Преобразует устаревший формат агрегации
 * @param {object | string} aggregation - значение агрегации виджета
 * @returns {string}
 */
const aggregation = (aggregation: Object | string) => {
	if (aggregation && typeof aggregation === 'object') {
		return aggregation.value;
	}

	return aggregation || DEFAULT_AGGREGATION.COUNT;
};

/**
 * Преобразует устаревший формат значений
 * @param {object} object - значение виджета
 * @param {object} defaultValue - значение по умолчанию
 * @returns {object}
 */
const object = (object: Object | null, defaultValue: Object = {}) => object && typeof object === 'object' ? object : defaultValue;

/**
 * Преобразует устаревший формат значений
 * @param {any} string - значение виджета
 * @param {string} defaultValue - значение по умолчанию
 * @returns {string}
 */
const string = (string: any, defaultValue: string = '') => typeof string === 'string' ? string : defaultValue;

/**
 * Преобразует устаревший формат группировки
 * @param {object | string} group - значение группировки виджета
 * @returns {group}
 */
const group = (group: Object | string) => typeof group === 'string' ? createDefaultGroup(group) : group;

/**
 * Преобразует устаревший формат набора цветов
 * @param {Array<string> | null} colors - значение цветов виджета
 * @returns {Array<string>}
 */
const colors = (colors?: Array<string>) => Array.isArray(colors) ? colors : [...DEFAULT_COLORS];

/**
 * Преобразует устаревший формат значений
 * @param {Array} array - значение виджета
 * @returns {Array<any>}
 */
const array = <T>(array?: Array<T>): Array<T> => Array.isArray(array) ? array : [];

/**
 * Преобразует данные к текущему формату настроек меток данных графика
 * @param {object} widget - виджет
 * @returns {object}
 */
const dataLabels = (widget: Object): DataLabels => {
	const {dataLabels = {}, showValue} = widget;
	const {
		show = Boolean(showValue)
	} = dataLabels;

	return {
		...DEFAULT_CHART_SETTINGS.dataLabels,
		...dataLabels,
		show
	};
};

/**
 * Преобразует данные к текущему формату настроек отображения заголовка виджета
 * @param {object} widget - виджет
 * @returns {object}
 */
const header = (widget: Object): Header => {
	const {diagramName = '', header = {}, showName} = widget;
	const {
		name = diagramName,
		show = Boolean(showName),
		template
	} = header;

	return {
		...DEFAULT_HEADER_SETTINGS,
		...header,
		name,
		show,
		template: template || name
	};
};

/**
 * Преобразует устаревший формат положения легенды
 * @param {any} value - позиция легенды виджета
 * @returns {string}
 */
const getLegendPosition = (value: any) => {
	let position = value;

	if (typeof position !== 'string') {
		position = position && typeof position === 'object' ? position.value : LEGEND_POSITIONS.bottom;
	}

	return position;
};

/**
 * Преобразует данные к текущему формату настроек отображения легенды графика
 * @param {object} widget - виджет
 * @returns {object}
 */
const legend = (widget: Object): Legend => {
	const {legend = {}, showLegend, legendPosition} = widget;
	const {
		position = getLegendPosition(legendPosition),
		show = Boolean(showLegend)
	} = legend;

	return {
		...extend(DEFAULT_CHART_SETTINGS.legend, legend),
		position,
		show
	};
};

/**
 * Проверяет имеет ли виджет порядковое наименование полей
 * @param {any} order - массив порядковых номеров
 * @returns {boolean}
 */
const hasOrdinalFormat = ({order}: LegacyWidget) => Array.isArray(order) && order.length > 0;

/**
 * Возвращает порядковое наименование поля
 * @param {string} name - базовое название поля
 * @param {number} number - порядковый номер
 * @returns {string}
 */
const createOrdinalName = (name: string, number: number) => `${name}_${number}`;

/**
 * Преобразует данные с использованием порядковых наименования в массив объектов с базовыми наименованиями
 * @param {LegacyWidget} widget - виджет
 * @param {object} fields - список базовых полей
 * @param {CreateFunction} createFunction - создает объект данных для каждого порядкового номера
 * @returns {string}
 */
const getOrdinalData = (widget: LegacyWidget, fields: Fields, createFunction: CreateFunction): Array<Object> => {
	const data = [];
	const {order} = widget;

	order.forEach(num => {
		const ordinalFields = {};

		Object.keys(fields).forEach(field => {
			ordinalFields[field] = createOrdinalName(field, num);
		});

		data.push(
			createFunction(widget, ordinalFields)
		);
	});

	return data;
};

/**
 * Возвращает главный набор данных для построения виджета
 * @param {Array<object>} data - массив данных виджета
 * @returns {object} - при наличии, возвращает главный набор данных для построения, иначе mock-объект
 */
const getMainDataSet = (data: Array<Object>): Object => data.find(set => !set.sourceForCompute) || mock;

/**
 * Нормализует данные разбивки
 * @param {number} index - индекс набора данных разбивки
 * @param {Array<object>} data - массив набора данных виджета
 * @param {string} indicatorKey - наименование поля индикатора
 * @returns {Attribute | ComputedBreakdown | undefined} - при наличии, возвращает экземпляр разбивки
 */
const breakdown = (index: number, data: Array<Object>, indicatorKey: string = FIELDS.indicator): Object | Array<Object> => {
	const {breakdown: value, breakdownGroup, [indicatorKey]: indicator, source} = getMainDataSet(data);
	let {breakdown} = data[index];

	if (indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR && isObject(breakdown)) {
		const usesDataSets = getMapValues(indicator.computeData).map(set => set.dataKey)
			.filter((key, i, keys) => keys.indexOf(key) === i);

		breakdown = data
			.filter(({dataKey}) => usesDataSets.includes(dataKey))
			.map(({dataKey}) => {
				const {source: currentSource} = data.find(set => set.dataKey === dataKey) || mock;
				const mainClassFqn = source.value.split('$')[0];
				const currentClassFqn = currentSource && currentSource.value.split('$')[0];
				const currentValue = mainClassFqn === currentClassFqn ? value : null;

				return {
					dataKey,
					group: transformGroupFormat(breakdownGroup),
					value: currentValue
				};
			});
	}

	return breakdown;
};

/**
 * В зависимости от наличия разбивки в исходном объекте, добавляет ее вместе с группировкой в таргет объект
 * @param {object} source - исходный объект
 * @param {object} target - таргет объект
 * @param {boolean} extendCustom - сообщает нужно ли проводить замену значения пользовательской группировки
 * @returns {object} - таргет объект
 */
const mixinBreakdown = (source: Object, target: Object, extendCustom: boolean = false) => {
	const {breakdown, breakdownGroup} = source;

	if (breakdown) {
		target.breakdown = breakdown;

		if (Array.isArray(breakdown)) {
			target.breakdown = target.breakdown.map(set => ({...set, group: transformGroupFormat(set.group, extendCustom)}));
		} else {
			target.breakdownGroup = transformGroupFormat(breakdownGroup, extendCustom);
		}
	}

	return target;
};

/**
 * Возвращает шаблон названия виджета
 * @param {object} widget - виджет
 * @returns {string} - шаблон названия
 */
const templateName = (widget: Object) => {
	const {name, templateName} = widget;
	return templateName || name;
};

export {
	aggregation,
	array,
	axisIndicator,
	axisParameter,
	breakdown,
	chartSorting,
	colors,
	dataLabels,
	group,
	getMainDataSet,
	getOrdinalData,
	hasOrdinalFormat,
	header,
	legend,
	mixinBreakdown,
	object,
	string,
	templateName
};
