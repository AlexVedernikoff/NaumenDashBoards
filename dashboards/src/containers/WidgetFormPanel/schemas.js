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
).nullable();

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

const comboChart = (values: FormikValues) => {
	const {source, xAxis, yAxis} = FIELDS;
	const {order = []} = values;
	const rules = {...baseRules};

	order.forEach(num => {
		rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
		rules[createOrderName(num)(xAxis)] = object().nullable().required(requiredXAxis);

		if (!values[createOrderName(num)(FIELDS.sourceForCompute)]) {
			rules[createOrderName(num)(yAxis)] = object().nullable().required(requiredYAxis);
		}
	});

	return rules;
};

const summary = ({order = []}: FormikValues) => {
	const {indicator, source} = FIELDS;
	const rules = {...baseRules};

	const num = order[0];
	rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
	rules[createOrderName(num)(indicator)] = object().nullable().required(requiredIndicator);

	return rules;
};

const table = (values: FormikValues) => {
	const {breakdown, column, row, source} = FIELDS;
	const rules = {...baseRules};
	const {order = []} = values;

	order.forEach(num => {
		rules[createOrderName(num)(source)] = object().nullable().required(requiredSource);
		rules[createOrderName(num)(row)] = object().nullable().required('Укажите атрибут для строк');

		if (!values[createOrderName(num)(FIELDS.sourceForCompute)]) {
			rules[createOrderName(num)(breakdown)] = requiredBreakdownRule;
			rules[createOrderName(num)(column)] = object().nullable().required('Укажите атрибут для колонок');
		}
	});

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

const resolveRules = (values: FormikValues) => {
	const {type} = values;
	return [COMBO, SUMMARY, TABLE].includes(type) ? compositeVariants[type](values) : commonVariants[type];
};

const getSchema = (values: FormikValues) => object(resolveRules(values));

export default getSchema;
