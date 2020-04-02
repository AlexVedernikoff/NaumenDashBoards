// @flow
import {array, lazy, object, string} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

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

/**
 * Правило для валидации атрибута
 * @param {string} text - текст сообщения
 * @returns {*}
 */
const requiredAttributeRule = (text: string) => object().test(
	'required-attribute',
	text,
	validateAttribute
).nullable();

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @returns {object}
 */
const conditionalBreakdownRule = object().when(FIELDS.withBreakdown, {
	is: true,
	then: requiredAttributeRule(getErrorMessage(FIELDS.breakdown))
}).nullable();

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {string} key - название поля
 * @returns {object}
 */
const conditionalComputeRule = (key: string) => object().when(FIELDS.sourceForCompute, {
	is: false,
	then: requiredAttributeRule(getErrorMessage(key))
}).nullable();

/*
	Типовые правила делятся на постоянные (permanent) и на те, что необходимо валидировать только в случаем если
	источник используется не только для вычислений (situational).
 */

// Правила для линейных графиков (кроме комбо)
const getAxisChartRules = (conditionalBreakdown: boolean) => {
	const {breakdown, source, sourceForCompute, xAxis, yAxis} = FIELDS;

	return {
		data: array().of(object({
			[breakdown]: object().when(sourceForCompute, {
				is: false,
				then: conditionalBreakdown ? conditionalBreakdownRule : requiredAttributeRule(getErrorMessage(breakdown))
			}),
			[source]: object().required(getErrorMessage(source)).nullable(),
			[xAxis]: requiredAttributeRule(getErrorMessage(xAxis)),
			[yAxis]: conditionalComputeRule(yAxis)
		}))
	};
};

// Правила для круговых диаграмм (pie, donut)
const getCircleChartRules = () => {
	const {breakdown, indicator, source} = FIELDS;

	return {
		data: array().of(object({
			[breakdown]: conditionalComputeRule(breakdown),
			[indicator]: conditionalComputeRule(indicator),
			[source]: object().required(getErrorMessage(source)).nullable()
		}))
	};
};

// Правила для комбо-диграммы
const getComboChartRules = () => {
	const {breakdown, source, xAxis, yAxis} = FIELDS;

	return {
		data: array().of(object({
			[breakdown]: conditionalBreakdownRule,
			[source]: object().required(getErrorMessage(source)).nullable(),
			[xAxis]: requiredAttributeRule(getErrorMessage(xAxis)),
			[yAxis]: conditionalComputeRule(yAxis)
		}))
	};
};

// Правила для сводки
const getSummaryRules = () => {
	const {indicator, source} = FIELDS;

	return {
		data: array().of(object({
			[indicator]: conditionalComputeRule(indicator),
			[source]: object().required(getErrorMessage(source)).nullable()
		}))
	};
};

// Правила для таблицы
const getTableRules = () => {
	const {breakdown, column, row, source} = FIELDS;

	return {
		data: array().of(object({
			[breakdown]: conditionalComputeRule(breakdown),
			[column]: conditionalComputeRule(column),
			[row]: requiredAttributeRule(getErrorMessage(row)),
			[source]: object().required(getErrorMessage(source)).nullable()
		}))
	};
};

const resolve = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

	switch (type) {
		case BAR:
		case COLUMN:
		case LINE:
			return getAxisChartRules(true);
		case BAR_STACKED:
		case COLUMN_STACKED:
			return getAxisChartRules(false);
		case COMBO:
			return getComboChartRules();
		case DONUT:
		case PIE:
			return getCircleChartRules();
		case SUMMARY:
			return getSummaryRules();
		case TABLE:
			return getTableRules();
		default:
			return {};
	}
};

const schema = lazy(({type}: Object) => object({
	[FIELDS.diagramName]: string().required(getErrorMessage(FIELDS.diagramName)),
	[FIELDS.name]: string().required(getErrorMessage(FIELDS.name)),
	...resolve(type)
}));

export default schema;
