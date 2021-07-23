// @flow
import type {AnyWidget, Group, MixedAttribute, Widget, WidgetType} from './data/types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	DATETIME_SYSTEM_GROUP,
	DEFAULT_AGGREGATION,
	DEFAULT_SYSTEM_GROUP,
	GROUP_WAYS,
	INTEGER_AGGREGATION,
	INTERVALS
} from './constants';
import {DISPLAY_MODE, WIDGET_TYPES} from './data/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import NewWidget from 'store/widgets/data/NewWidget';

const createDefaultGroup = (data?: string | null, attribute?: Attribute) => {
	if (!data || typeof data !== 'string') {
		return getDefaultSystemGroup(attribute);
	}

	return ({
		data,
		way: GROUP_WAYS.SYSTEM
	});
};

const getDefaultSystemGroup = (attribute?: Object) => {
	const target = attribute?.ref || attribute;

	if (target) {
		const {type} = target;

		if (type === ATTRIBUTE_TYPES.dtInterval) {
			return createDefaultGroup(DATETIME_SYSTEM_GROUP.WEEK);
		}

		if (type in ATTRIBUTE_SETS.DATE) {
			return createDefaultGroup(DATETIME_SYSTEM_GROUP.MONTH);
		}
	}

	return createDefaultGroup(DEFAULT_SYSTEM_GROUP.OVERLAP);
};

/**
 * Фильтрует виджеты по режиму отображения
 * @param {Array<Widget>} widgets - список виджетов
 * @param {LayoutMode} mode - режим отображения
 * @returns {Array<Widget>}
 */
const getLayoutWidgets = (widgets: Array<Widget>, mode: LayoutMode): Array<Widget> => {
	return widgets.filter(item => (!item.displayMode && mode === LAYOUT_MODE.WEB) || item.displayMode === mode || item.displayMode === DISPLAY_MODE.ANY);
};

/**
 * Сообщает используется ли в наборе данных виджета агрегация в процентах
 * @param {MixedAttribute | null} attribute - атрибут
 * @param {string} aggregation - агрегация атрибута
 * @returns {boolean}
 */
const hasPercent = (attribute: MixedAttribute | null, aggregation: string): boolean => {
	return Boolean(attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && aggregation === DEFAULT_AGGREGATION.PERCENT);
};

/**
 * Сообщает об использовании uuid в лейблах
 * @param {Attribute} attribute - атрибут
 * @param {Group} group - группировка
 * @returns {boolean}
 */
const hasUUIDsInLabels = (attribute?: Attribute, group?: Group): boolean => {
	const {dtInterval, metaClass, state} = ATTRIBUTE_TYPES;

	return (attribute && attribute.type in ATTRIBUTE_SETS.REFERENCE)
		|| attribute?.type === metaClass
		|| attribute?.type === state
		|| attribute?.type === dtInterval
		|| group?.way === GROUP_WAYS.CUSTOM;
};

/**
 * Сообщает используется ли в наборе данных виджета агрегация, по которой возвращается интервал в миллисекундах
 * @param {MixedAttribute | null} attribute - атрибут
 * @param {string} aggregation - агрегация атрибута
 * @returns {boolean}
 */
const hasMSInterval = (attribute: MixedAttribute | null, aggregation: string): boolean => {
	return Boolean(attribute && attribute.type === ATTRIBUTE_TYPES.dtInterval && aggregation in INTEGER_AGGREGATION);
};

/**
 * Преобразует интервал из миллисекунд в понятный для пользователя вид
 * @param {number} ms - значение интервала в миллисекундах
 * @returns {string}
 */
const parseMSInterval = (ms: number) => {
	const intervalData = INTERVALS.find(({max, min}) => ms > min && ms < max);

	if (intervalData) {
		const {label, min} = intervalData;
		let intervalValue = ms / min;

		intervalValue = ms > INTERVALS[INTERVALS.length - 1].min ? intervalValue.toFixed(2) : Math.round(intervalValue);

		return `${intervalValue} ${label}`;
	}

	return ms;
};

/**
 * Сообщает используется ли в наборе данных виджета разбивка
 * @param {object} widget - виджет
 * @returns {boolean}
 */
const hasBreakdown = (widget: Object): boolean => widget.id !== NewWidget.id && !!widget.data
		.find(({breakdown, sourceForCompute}) => !sourceForCompute && Array.isArray(breakdown));

/**
 * Проверяет является ли переданный тип агрегации допустимым для выборки топ значений
 * @param {string} aggregation - тип агрегации
 * @returns {boolean}
 */
const isAllowedTopAggregation = (aggregation?: string) => aggregation !== DEFAULT_AGGREGATION.NOT_APPLICABLE;

/**
 * Проверяет принадлежность типа виджета к осевым графикам
 * @param {AnyWidget | string} type - тип виджета
 * @returns {boolean}
 */
const isAxisChart = (type: WidgetType | string): boolean => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE} = WIDGET_TYPES;

	return [BAR, BAR_STACKED, COMBO, COLUMN, COLUMN_STACKED, LINE].includes(type);
};

/**
 * Проверяет принадлежность типа виджета к круговым графикам
 * @param {AnyWidget | string} type - тип виджета
 * @returns {boolean}
 */
const isCircleChart = (type: WidgetType | string): boolean => {
	const {DONUT, PIE} = WIDGET_TYPES;

	return [DONUT, PIE].includes(type);
};

/**
 * Проверяет принадлежность типа виджета к горизонтальным графикам
 * @param {AnyWidget} type - тип виджета
 * @returns {boolean}
 */
const isHorizontalChart = (type: WidgetType): boolean => {
	const {BAR, BAR_STACKED} = WIDGET_TYPES;

	return [BAR, BAR_STACKED].includes(type);
};

/**
 * Проверяет принадлежность типа виджета к графикам с накоплением
 * @param {AnyWidget} type - тип виджета
 * @returns {boolean}
 */
const isStackedChart = (type: WidgetType): boolean => {
	const {BAR_STACKED, COLUMN_STACKED} = WIDGET_TYPES;

	return [BAR_STACKED, COLUMN_STACKED].includes(type);
};

/**
 * Проверяет возможность наличия глобальных настроек цветов
 * @param {AnyWidget} type - тип виджета
 * @returns {boolean}
 */
const hasChartColorsSettings = (type: WidgetType): boolean => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED} = WIDGET_TYPES;
	const barCharts = [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED];

	return isCircleChart(type) || barCharts.includes(type);
};

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	getLayoutWidgets,
	hasBreakdown,
	hasChartColorsSettings,
	hasUUIDsInLabels,
	hasMSInterval,
	hasPercent,
	isAllowedTopAggregation,
	isAxisChart,
	isCircleChart,
	isHorizontalChart,
	isStackedChart,
	parseMSInterval
};
