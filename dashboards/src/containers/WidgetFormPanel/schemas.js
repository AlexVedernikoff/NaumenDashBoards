// @flow
import {array, object, string} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CHART_VARIANTS} from 'utils/chart/constants';
import {createOrdinalName, WIDGET_VARIANTS} from 'utils/widget';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {FormikValues} from 'formik';

const ERROR_MESSAGES = {
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

const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
const {SUMMARY, TABLE} = WIDGET_VARIANTS;

/**
 * Валидация атрибута с учетом вложенности (ссылочного атрибута)
 * @param {Attribute} value - атрибут
 * @returns {boolean}
 */
const validateAttribute = (value: Attribute | null) => {
	if (value && value.type in ATTRIBUTE_SETS) {
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
 * @param {string} withBreakdownName - название поля, которое регулирует добавление разбивки
 * @returns {*}
 */
const conditionBreakdownRule = (withBreakdownName: string) => object().when(withBreakdownName, {
	is: true,
	then: requiredAttributeRule(ERROR_MESSAGES[FIELDS.breakdown])
}).nullable();

// Базовые правила для всех диаграмм
const BASE_RULES = {
	[FIELDS.diagramName]: string().required(ERROR_MESSAGES[FIELDS.diagramName]),
	[FIELDS.name]: string().required(ERROR_MESSAGES[FIELDS.name])
};

/*
	Типовые правила делятся на постоянные (permanent) и на те, что необходимо валидировать только в случаем если
	источник используется не только для вычислений (situational).
 */

// Правила для линейных графиков (кроме комбо)
const getAxisChartRules = (conditionBreakdown: boolean) => (values: FormikValues, rules: Object) => {
	const {breakdown, source, sourceForCompute, withBreakdown, xAxis, yAxis} = FIELDS;
	const {order} = values;

	order.forEach(number => {
		rules[createOrdinalName(xAxis, number)] = requiredAttributeRule(ERROR_MESSAGES[xAxis]);
		rules[createOrdinalName(source, number)] = requiredAttributeRule(ERROR_MESSAGES[source]);

		if (!values[createOrdinalName(sourceForCompute, number)]) {
			rules[createOrdinalName(yAxis, number)] = requiredAttributeRule(ERROR_MESSAGES[yAxis]);
			rules[createOrdinalName(breakdown, number)] = conditionBreakdown
				? conditionBreakdownRule(createOrdinalName(withBreakdown, number))
				: requiredAttributeRule(ERROR_MESSAGES[breakdown]);
		}
	});

	return rules;
};

// Правила для круговых диаграмм (pie, donut)
const getCircleChartRules = (values: FormikValues, rules: Object) => {
	const {breakdown, indicator, source, sourceForCompute} = FIELDS;
	const {order} = values;

	order.forEach(number => {
		rules[createOrdinalName(source, number)] = requiredAttributeRule(ERROR_MESSAGES[source]);

		if (!values[createOrdinalName(sourceForCompute, number)]) {
			rules[createOrdinalName(breakdown, number)] = requiredAttributeRule(ERROR_MESSAGES[breakdown]);
			rules[createOrdinalName(indicator, number)] = requiredAttributeRule(ERROR_MESSAGES[indicator]);
		}
	});

	return rules;
};

// Правила для комбо-диграммы
const getComboChartRules = (values: FormikValues, rules: Object) => {
	const {breakdown, source, sourceForCompute, xAxis, yAxis} = FIELDS;
	const {order} = values;

	rules[FIELDS.order] = array().test(
		'required-building-sources',
		`Для данного типа графика необходимо использовать как минимум 2 источника для построения`,
		order => {
			let buildingSources = 0;

			order.forEach(number => {
				if (!values[createOrdinalName(sourceForCompute, number)]) {
					buildingSources++;
				}
			});

			return buildingSources >= 2;
		}
	);

	order.forEach(number => {
		rules[createOrdinalName(source, number)] = requiredAttributeRule(ERROR_MESSAGES[source]);
		rules[createOrdinalName(xAxis, number)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.xAxis]);

		if (!values[createOrdinalName(sourceForCompute, number)]) {
			rules[createOrdinalName(breakdown, number)] = conditionBreakdownRule(createOrdinalName(FIELDS.withBreakdown, number));
			rules[createOrdinalName(yAxis, number)] = requiredAttributeRule(ERROR_MESSAGES[yAxis]);
		}
	});

	return rules;
};

// Правила для сводки
const getSummaryRules = (values: FormikValues, rules: Object) => {
	const {indicator, source, sourceForCompute} = FIELDS;
	const {order} = values;

	order.forEach(number => {
		rules[createOrdinalName(source, number)] = requiredAttributeRule(ERROR_MESSAGES[source]);

		if (!values[createOrdinalName(sourceForCompute, number)]) {
			rules[createOrdinalName(indicator, number)] = requiredAttributeRule(ERROR_MESSAGES[indicator]);
		}
	});

	return rules;
};

// Правила для таблицы
const getTableRules = (values: FormikValues, rules: Object) => {
	const {breakdown, column, row, source, sourceForCompute} = FIELDS;
	const {order} = values;

	order.forEach(number => {
		rules[createOrdinalName(source, number)] = requiredAttributeRule(ERROR_MESSAGES[source]);
		rules[createOrdinalName(row, number)] = requiredAttributeRule(ERROR_MESSAGES[row]);

		if (!values[createOrdinalName(sourceForCompute, number)]) {
			rules[createOrdinalName(breakdown, number)] = requiredAttributeRule(ERROR_MESSAGES[breakdown]);
			rules[createOrdinalName(column, number)] = requiredAttributeRule(ERROR_MESSAGES[column]);
		}
	});

	return rules;
};

const variants = {
	[BAR]: getAxisChartRules(true),
	[BAR_STACKED]: getAxisChartRules(false),
	[COLUMN]: getAxisChartRules(true),
	[COLUMN_STACKED]: getAxisChartRules(false),
	[COMBO]: getComboChartRules,
	[DONUT]: getCircleChartRules,
	[LINE]: getAxisChartRules(true),
	[PIE]: getCircleChartRules,
	[SUMMARY]: getSummaryRules,
	[TABLE]: getTableRules
};

const resolveRules = (values: FormikValues) => {
	const {order, type} = values;
	return Array.isArray(order) ? variants[type](values, {...BASE_RULES}) : BASE_RULES;
};

const getSchema = (values: FormikValues) => object(resolveRules(values));

export default getSchema;
