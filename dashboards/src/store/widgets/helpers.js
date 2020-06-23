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
import {getBuildSet} from 'store/widgets/data/helpers';
import type {Group, Widget} from './data/types';
import {store} from 'src';
import {UNSUPPORTED_DRILL_DOWN_FORMATS} from 'components/molecules/GroupCreatingModal/components/DateSystemGroup/constants';

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
 * Функция проверяет имеет ли группировка не поддерживаемый, для перехода на список данных, формат
 * @param {Group} group - группировка атрибута
 * @returns {boolean}
 */
const hasUnsupportedDrillDownFormat = (group: Group) => {
	let unsupported = false;

	if (group) {
		const {format, way} = group;
		unsupported = way === GROUP_WAYS.SYSTEM && format && UNSUPPORTED_DRILL_DOWN_FORMATS.includes(format);
	}

	return unsupported;
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

const usesUnsupportedDrillDownGroup = (data: Widget) => {
	const buildSet: Object = getBuildSet(data);
	const {breakdownGroup, group} = buildSet;

	return hasUnsupportedDrillDownFormat(group) || hasUnsupportedDrillDownFormat(breakdownGroup);
};

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	hasMSInterval,
	hasPercent,
	isGroupKey,
	parseMSInterval,
	transformGroupFormat,
	usesUnsupportedDrillDownGroup
};
