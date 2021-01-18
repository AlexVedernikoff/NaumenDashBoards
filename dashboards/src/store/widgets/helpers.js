// @flow
import type {AnyWidget, Group, Widget, WidgetType} from './data/types';
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
import type {DiagramFormWidget} from 'containers/DiagramWidgetEditForm/types';
import {DISPLAY_MODE, WIDGET_TYPES} from './data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import type {LayoutMode} from 'store/dashboard/settings/types';
import {store} from 'src';

const createDefaultGroup = (data?: string | null, attribute?: Attribute) => {
	if (!data || typeof data !== 'string') {
		return getDefaultSystemGroup(attribute);
	}

	return ({
		data,
		way: GROUP_WAYS.SYSTEM
	});
};

const isGroupKey = (key: string) => /group/i.test(key);

const transformGroupFormat = (group?: Group, extendCustom: boolean = true) => {
	let resultGroup = group;

	if (!group || typeof group !== 'object') {
		resultGroup = createDefaultGroup(group);
	} else if (extendCustom && group.way === GROUP_WAYS.CUSTOM) {
		const {customGroups} = store.getState();

		resultGroup = {
			...group,
			data: customGroups.original[group.data]
		};
	}

	return resultGroup;
};

const getDefaultSystemGroup = (attribute: Object) => attribute && typeof attribute === 'object' && attribute.type in ATTRIBUTE_SETS.DATE
	? createDefaultGroup(DATETIME_SYSTEM_GROUP.MONTH)
	: createDefaultGroup(DEFAULT_SYSTEM_GROUP.OVERLAP);

/**
 * Фильтрует виджеты по режиму отображения
 * @param {Array<Widget>} widgets - список виджетов
 * @param {LayoutMode} mode - режим отображения
 * @returns {Array<Widget>}
 */
const	getLayoutWidgets = (widgets: Array<Widget>, mode: LayoutMode): Array<Widget> => {
	return widgets.filter(item => item.displayMode === mode || item.displayMode === DISPLAY_MODE.ANY);
};

/**
 * Сообщает используется ли в наборе данных виджета агрегация в процентах
 * @param {object} set - набор данных виджета
 * @param {string} field - наименования поля показателя виджета
 * @returns {boolean}
 */
const hasPercent = (set: Object, field: string = FIELDS.indicator) => {
	const {aggregation, [field]: indicator} = set;
	return indicator.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && aggregation === DEFAULT_AGGREGATION.PERCENT;
};

/**
 * Сообщает об использовании uuid в лейблах
 * @param {Attribute} attribute - атрибут
 * @returns {boolean}
 */
const hasUUIDsInLabels = (attribute?: Attribute): boolean => {
	const {backBOLinks, boLinks, metaClass} = ATTRIBUTE_TYPES;
	return Boolean(attribute && [backBOLinks, boLinks, metaClass].includes(attribute.type));
};

/**
 * Сообщает используется ли в наборе данных виджета агрегация, по которой возвращается интервал в миллисекундах
 * @param {object} set - набор данных виджета
 * @param {string} field - наименования поля показателя виджета
 * @returns {boolean}
 */
const hasMSInterval = (set: Object, field: string = FIELDS.indicator) => {
	const {aggregation, [field]: indicator} = set;
	return indicator.type === ATTRIBUTE_TYPES.dtInterval && aggregation in INTEGER_AGGREGATION;
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
const hasBreakdown = (widget: Object): boolean => !!widget.data
		.filter(set => !set.sourceForCompute)
		.find(set => !!set[FIELDS.breakdown]);

/**
 * Проверяет является ли переданный тип агрегации допустимым для выборки топ значений
 * @param {string} aggregation - тип агрегации
 * @returns {boolean}
 */
const isAllowedTopAggregation = (aggregation: string) => {
	const {COUNT, PERCENT} = DEFAULT_AGGREGATION;
	const {AVG, MAX, MIN} = INTEGER_AGGREGATION;
	const allowedAggregations = [AVG, COUNT, MAX, MIN, PERCENT];

	return allowedAggregations.includes(aggregation);
};

/**
 * Сообщает используется ли в наборе данных виджета пользовательская группировка
 * @param {DiagramFormWidget} widget - виджет
 * @param {boolean} checkBreakdown - указывает на необходимость проверки группировки разбивки
 * @returns {boolean}
 */
const usesCustomGroup = (widget: DiagramFormWidget, checkBreakdown: boolean): boolean => {
	const groupKeys = [FIELDS.group];

	if (checkBreakdown) {
		groupKeys.push(FIELDS.breakdownGroup);
	}

	return !!widget.data.find(set => {
		const {sourceForCompute} = set;
		return !sourceForCompute && groupKeys.find(key => set[key] && set[key].way === GROUP_WAYS.CUSTOM);
	});
};

/**
 * Проверяет принадлежность типа виджета к осевым графикам
 * @param {AnyWidget} type - тип виджета
 * @returns {boolean}
 */
const isAxisChart = (type: WidgetType): boolean => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE} = WIDGET_TYPES;
	return [BAR, BAR_STACKED, COMBO, COLUMN, COLUMN_STACKED, LINE].includes(type);
};

/**
 * Проверяет принадлежность типа виджета к круговым графикам
 * @param {AnyWidget} type - тип виджета
 * @returns {boolean}
 */
const isCircleChart = (type: WidgetType) => {
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

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	getLayoutWidgets,
	hasBreakdown,
	hasUUIDsInLabels,
	hasMSInterval,
	hasPercent,
	isAllowedTopAggregation,
	isAxisChart,
	isCircleChart,
	isHorizontalChart,
	isGroupKey,
	parseMSInterval,
	transformGroupFormat,
	usesCustomGroup
};
