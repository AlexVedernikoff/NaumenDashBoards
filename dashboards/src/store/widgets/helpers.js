// @flow
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
import {FIELDS} from 'WidgetFormPanel/constants';
import type {Group, Widget} from './data/types';
import {LAYOUT_MODE} from 'store/dashboard/constants';
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
			data: customGroups[group.data]
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
 * @param {string} mode - режим отображения
 * @returns {Array<Widget>}
 */
const	getLayoutWidgets = (widgets: Array<Widget>, mode: string): Array<Widget> => {
	return widgets.filter(item => (item.displayMode === mode || item.displayMode === LAYOUT_MODE.WEB_MK));
};

/**
 * Сообщает используется ли в наборе данных виджета агрегация в процентах
 * @param {object} set - набор данных виджета
 * @returns {boolean}
 */
const hasPercent = (set: Object) => set.aggregation === DEFAULT_AGGREGATION.PERCENT;

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

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	getLayoutWidgets,
	hasMSInterval,
	hasPercent,
	isGroupKey,
	parseMSInterval,
	transformGroupFormat
};
