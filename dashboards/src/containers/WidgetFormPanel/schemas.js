// @flow
import {CHART_VARIANTS} from 'utils/chart/constants';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {FormikValues} from 'formik';
import {object, string} from 'yup';

const requiredXAxis = 'Укажите атрибут для оси X';
const requiredYAxis = 'Укажите атрибут для оси Y';
const requiredIndicator = 'Укажите показатель';
const requiredName = 'Укажите название виджета';
const requiredDiagramName = 'Укажите название виджета';
const requiredSource = 'Укажите источник данных';

const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
const {SUMMARY, TABLE} = WIDGET_VARIANTS;

const requiredBreakdownRule = object().test(
	'required-breackdown',
	'Укажите разбивку',
	value => value && value.code
);

const baseRules = {
	diagramName: string().required(requiredDiagramName),
	name: string().required(requiredName)
};

const axisChart = {
	...baseRules,
	source: object().nullable().required(requiredSource),
	xAxis: object().nullable().required(requiredXAxis),
	yAxis: object().nullable().required(requiredYAxis)
};

const axisStackedChart = {
	...axisChart,
	breakdown: requiredBreakdownRule
};

const circleChart = {
	...baseRules,
	breakdown: requiredBreakdownRule,
	indicator: object().nullable().required(requiredIndicator),
	source: object().nullable().required(requiredSource)
};

const existsOrder = (order: Array<number> | null) => Array.isArray(order) && order.length > 0;

const comboChart = (order = []) => {
	const {source, xAxis, yAxis} = FIELDS;
	const rules = {...baseRules};

	if (order) {
		order.forEach(num => {
			rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
			rules[createOrderName(num)(xAxis)] = object().nullable().required(requiredXAxis);
			rules[createOrderName(num)(yAxis)] = object().nullable().required(requiredYAxis);
		});
	}

	return rules;
};

const summary = (order) => {
	const {indicator, source} = FIELDS;
	const rules = {...baseRules};

	if (existsOrder(order)) {
		const num = order[0];
		rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
		rules[createOrderName(num)(indicator)] = object().nullable().required(requiredIndicator);
	}

	return rules;
};

const table = (order) => {
	const {breakdown, column, row, source} = FIELDS;
	const rules = {...baseRules};

	if (existsOrder(order)) {
		const num = order[0];
		rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
		rules[createOrderName(num)(breakdown)] = requiredBreakdownRule;
		rules[createOrderName(num)(column)] = object().nullable().required('Укажите атрибут для колонок');
		rules[createOrderName(num)(row)] = object().nullable().required('Укажите атрибут для строк');
	}

	return rules;
};

const commonVariants = {
	[BAR]: axisChart,
	[BAR_STACKED]: axisStackedChart,
	[COLUMN]: axisChart,
	[COLUMN_STACKED]: axisStackedChart,
	[BAR]: axisChart,
	[LINE]: axisChart,
	[DONUT]: circleChart,
	[PIE]: circleChart
};

const compositeVariants = {
	[COMBO]: comboChart,
	[SUMMARY]: summary,
	[TABLE]: table
};

/*
	В отличии от таблицы и сводки, у комбо диаграммы набор полей для валидации может динамически
	меняться. Данная функция возвращает актуальный набор порядка полей, к которым нужно применять правила валидации.
 */
const getComboValidateOrder = (values: FormikValues) => {
	const order = values.order || [];
	const orderForValidate = [];

	if (Array.isArray(order)) {
		order.forEach(num => {
			if (!values[createOrderName(num)(FIELDS.sourceForCompute)]) {
				orderForValidate.push(num);
			}
		});
	}

	return orderForValidate;
};

const resolveRules = (values: FormikValues) => {
	const type = values.type.value;
	const order = type === COMBO ? getComboValidateOrder(values) : values.order;
	return [COMBO, SUMMARY, TABLE].includes(type) ? compositeVariants[type](order) : commonVariants[type];
};

const getSchema = (values: FormikValues) => object(resolveRules(values));

export default getSchema;
