// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {CHART_VARIANTS} from 'utils/chart/constants';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';
import {FIELDS, TYPES} from 'components/organisms/WidgetFormPanel';
import type {FormikValues} from 'formik';
import {object, string} from 'yup';

const ERROR_MESSAGES = {
	breakdown: 'Укажите атрибут для разбивки',
	column: 'Укажите атрибут для колонок',
	indicator: 'Укажите атрибут для показателя',
	name: 'Укажите название виджета',
	row: 'Укажите атрибут для строк',
	source: 'Укажите источник данных',
	xAxis: 'Укажите атрибут для оси X',
	yAxis: 'Укажите атрибут для оси Y'
};

const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
const {SUMMARY, TABLE} = WIDGET_VARIANTS;

/**
 * Валидация атрибута с учетом вложенности (ссылочного атрибута)
 * @param {Attribute} value - атрибут
 * @returns {boolean}
 */
const validateAttribute = (value: Attribute) => {
	if (value && TYPES.REF.includes(value.type)) {
		while (value.ref) {
			value = value.ref;
		}

		return !!value && !TYPES.REF.includes(value.type);
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
const baseRules = {
	diagramName: string().required(ERROR_MESSAGES[FIELDS.name]),
	name: string().required(ERROR_MESSAGES[FIELDS.name])
};

// Правила для столбчатых и линейных диаграмм (column, line)
const baseChart = {
	...baseRules,
	breakdown: conditionBreakdownRule(FIELDS.withBreakdown),
	source: object().nullable().required(ERROR_MESSAGES[FIELDS.source]),
	xAxis: requiredAttributeRule(ERROR_MESSAGES[FIELDS.xAxis]),
	yAxis: requiredAttributeRule(ERROR_MESSAGES[FIELDS.yAxis])
};

// Правила для столбчатой диаграммы с накоплением
const columnStakedChart = {
	...baseChart,
	breakdown: requiredAttributeRule(ERROR_MESSAGES[FIELDS.breakdown])
};

// Правила для гистограммы
const barChart = {
	...baseRules,
	breakdown: conditionBreakdownRule(FIELDS.withBreakdown),
	source: object().nullable().required(ERROR_MESSAGES[FIELDS.source]),
	xAxis: requiredAttributeRule(ERROR_MESSAGES[FIELDS.yAxis]),
	yAxis: requiredAttributeRule(ERROR_MESSAGES[FIELDS.xAxis])
};

// Правила для гистограммы с накоплением
const barStackedChart = {
	...barChart,
	breakdown: requiredAttributeRule(ERROR_MESSAGES[FIELDS.breakdown])
};

// Правила для круговых диаграмм (pie, donut)
const circleChart = {
	...baseRules,
	breakdown: requiredAttributeRule(ERROR_MESSAGES[FIELDS.breakdown]),
	indicator: requiredAttributeRule(ERROR_MESSAGES[FIELDS.indicator]),
	source: object().nullable().required(ERROR_MESSAGES[FIELDS.source])
};

// Правила для комбо-диграммы
const comboChart = (values: FormikValues) => {
	const {breakdown, source, xAxis, yAxis, withBreakdown} = FIELDS;
	const {order = []} = values;
	const rules = {...baseRules};

	order.forEach(num => {
		const createName = createOrderName(num);

		rules[createName(source)] = object().nullable().required(ERROR_MESSAGES[FIELDS.source]);
		rules[createName(xAxis)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.xAxis]);
		rules[createName(breakdown)] = conditionBreakdownRule(createName(withBreakdown));

		if (!values[createName(FIELDS.sourceForCompute)]) {
			rules[createName(yAxis)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.yAxis]);
		}
	});

	return rules;
};

// Правила для сводки
const summary = ({order = []}: FormikValues) => {
	const {indicator, source} = FIELDS;
	const rules = {...baseRules};

	const num = order[0];
	rules[createOrderName(num)(source)] = object().nullable().required(ERROR_MESSAGES[FIELDS.source]);
	rules[createOrderName(num)(indicator)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.indicator]);

	return rules;
};

// Правила для таблицы
const table = (values: FormikValues) => {
	const {breakdown, column, row, source} = FIELDS;
	const rules = {...baseRules};
	const {order = []} = values;

	order.forEach(num => {
		rules[createOrderName(num)(source)] = object().nullable().required(ERROR_MESSAGES[FIELDS.source]);
		rules[createOrderName(num)(row)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.row]);

		if (!values[createOrderName(num)(FIELDS.sourceForCompute)]) {
			rules[createOrderName(num)(breakdown)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.source]);
			rules[createOrderName(num)(column)] = requiredAttributeRule(ERROR_MESSAGES[FIELDS.column]);
		}
	});

	return rules;
};

const commonVariants = {
	[BAR]: barChart,
	[BAR_STACKED]: barStackedChart,
	[COLUMN]: baseChart,
	[COLUMN_STACKED]: columnStakedChart,
	[LINE]: baseChart,
	[DONUT]: circleChart,
	[PIE]: circleChart
};

const compositeVariants = {
	[COMBO]: comboChart,
	[SUMMARY]: summary,
	[TABLE]: table
};

const resolveRules = (values: FormikValues) => {
	const {type} = values;
	return [COMBO, SUMMARY, TABLE].includes(type) ? compositeVariants[type](values) : commonVariants[type];
};

const getSchema = (values: FormikValues) => object(resolveRules(values));

export default getSchema;
