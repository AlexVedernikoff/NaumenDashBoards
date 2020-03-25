// @flow
import {createDefaultGroup} from 'store/widgets/helpers';
import type {CreateFunction, Fields, LegacyWidget} from './types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_COLORS, LEGEND_POSITIONS} from 'utils/chart/constants';

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
 * Преобразует устаревший формат положения легенды
 * @param {any} position - позиция легенды виджета
 * @returns {string}
 */
const legendPosition = (position: any) => {
	if (typeof position !== 'string') {
		position = position && typeof position === 'object' ? position.value : LEGEND_POSITIONS.bottom;
	}

	return position;
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

export {
	aggregation,
	array,
	colors,
	group,
	getOrdinalData,
	hasOrdinalFormat,
	legendPosition,
	object,
	string
};
