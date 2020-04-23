// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from './constants';
import {object, string} from 'yup';

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
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @returns {object}
 */
const conditionalBreakdown = object().when(FIELDS.withBreakdown, {
	is: true,
	then: requiredAttribute(getErrorMessage(FIELDS.breakdown))
}).nullable();

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {string} key - название поля
 * @returns {object}
 */
const requiredByCompute = (key: string) => object().when(FIELDS.sourceForCompute, {
	is: false,
	then: requiredAttribute(getErrorMessage(key))
}).nullable();

const rules = {
	base,
	conditionalBreakdown,
	requiredAttribute,
	requiredByCompute
};

export {
	getErrorMessage,
	rules
};
