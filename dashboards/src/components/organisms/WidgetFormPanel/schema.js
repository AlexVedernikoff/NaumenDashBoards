// @flow
import {array, lazy, mixed, object, string} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {FIELDS} from './constants';

const getErrorMessage = (key: string) => {
	const messages = {
		[FIELDS.breakdown]: 'Укажите атрибут для разбивки',
		[FIELDS.column]: 'Укажите атрибут для колонок',
		[FIELDS.diagramName]: 'Укажите название диаграммы',
		[FIELDS.indicator]: 'Укажите атрибут для показателя',
		[FIELDS.name]: 'Укажите название виджета',
		[FIELDS.row]: 'Укажите атрибут для строк',
		[FIELDS.source]: 'Укажите источник данных',
		[FIELDS.xAxis]: 'Укажите атрибут для оси X',
		[FIELDS.yAxis]: 'Укажите атрибут для оси Y'
	};

	return messages[key] || 'Ошибка заполнения';
};

/**
 * Валидация атрибута с учетом вложенности (ссылочного атрибута)
 * @param {Attribute} value - атрибут
 * @returns {boolean}
 */
const validateAttribute = (value: Attribute | null) => {
	if (value && value.type in ATTRIBUTE_SETS.REF) {
		value = value.ref;
	}

	return !!value;
};

const base = {
	[FIELDS.header]: object({
		[FIELDS.name]: string().required(getErrorMessage(FIELDS.diagramName))
	}),
	[FIELDS.name]: string().required(getErrorMessage(FIELDS.name))
};

/**
 * Правило для валидации атрибута
 * @param {string} text - текст сообщения
 * @returns {*}
 */
const requiredAttribute = (text: string) => object().test(
	'required-attribute',
	text,
	validateAttribute
).nullable();

/**
 * Правило для валидации разбивки
 * @param {string} indicatorName - наименование поля индикатора
 * @returns {object}
 */
const requiredBreakdown = (indicatorName: string) => (value: mixed, context: Object) => {
	const message = getErrorMessage(FIELDS.breakdown);
	const indicator = context.parent[indicatorName];

	if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
		return array().of(object({
			value: requiredAttribute(message)
		}));
	}

	return requiredAttribute(message);
};

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @param {string} indicatorName - наименование поля индикатора
 * @returns {object}
 */
const conditionalBreakdown = (indicatorName: string) => mixed().when(FIELDS.withBreakdown, {
	is: true,
	then: lazy(requiredBreakdown(indicatorName))
});

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {string} key - название поля
 * @param {object} rule - правило
 * @returns {object}
 */
const requiredByCompute = (key: string, rule: Object) => {
	if (!rule) {
		rule = requiredAttribute(getErrorMessage(key));
	}

	return mixed().when(FIELDS.sourceForCompute, {
		is: false,
		then: rule
	}).nullable();
};

const rules = {
	base,
	conditionalBreakdown,
	requiredAttribute,
	requiredBreakdown,
	requiredByCompute
};

export {
	getErrorMessage,
	rules
};
