// @flow
import {addMethod, array, lazy, mixed, number, object, string} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import type {DefaultBreakdown, Parameter, SourceData} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {getDefaultParameter} from './helpers';
import {isObject} from 'helpers';

const getErrorMessage = (key: string) => {
	const messages = {
		[FIELDS.breakdown]: 'Укажите атрибут для разбивки',
		[FIELDS.diagramName]: 'Укажите название диаграммы',
		[FIELDS.indicator]: 'Укажите атрибут для показателя',
		[FIELDS.name]: 'Укажите название виджета',
		[FIELDS.parameter]: 'Укажите атрибут для параметра',
		[FIELDS.source]: 'Укажите источник данных',
		[FIELDS.xAxis]: 'Укажите атрибут для оси X',
		[FIELDS.yAxis]: 'Укажите атрибут для оси Y'
	};

	return messages[key] || 'Ошибка заполнения';
};

addMethod(mixed, 'source', function () {
	return this.test(
		'check-sources',
		'Укажите источник данных',
		({value}: SourceData) => !!value
	);
});

addMethod(mixed, 'sourceNumbers', function () {
	return this.test(
		'check-sources-number',
		'Для данного типа диаграммы источник может быть один, дополнительные можно использовать для вычисления',
		function () {
			const {data} = this.options.parent;
			return data.filter(dataSet => !dataSet.sourceForCompute).length === 1;
		});
});

addMethod(mixed, 'minSourceNumbers', function () {
	return this.test(
		'check-min-source-numbers',
		'Должен быть выбран как минимум один источник для построения',
		function () {
			const {data} = this.options.parent;
			return data.filter(dataSet => !dataSet.sourceForCompute).length > 0;
		});
});

addMethod(mixed, 'requiredAttribute', function (text: string) {
	return this.test(
		'check-attribute',
		text,
		({attribute} = {}) => validateAttribute(attribute)
	);
});

addMethod(mixed, 'group', function () {
	return this.test(
		'check-attribute-group',
		'Группировка данного атрибута не применима к другим полям',
		function (attributeData: Parameter | DefaultBreakdown) {
			const {data} = this.options.values;
			const {attribute, group} = attributeData;
			const {DAY, HOURS, MINUTES} = DATETIME_SYSTEM_GROUP;
			const {dateTime} = ATTRIBUTE_TYPES;
			let result = true;

			if (attribute && attribute.type === dateTime && group.way === GROUP_WAYS.SYSTEM) {
				const {data: groupData, format} = group;
				const useTime = groupData === HOURS || groupData === MINUTES || (groupData === DAY && format && format.includes('hh'));

				if (useTime) {
					result = data.findIndex(({parameters}) => {
						return parameters.findIndex(({attribute}) => attribute && attribute.type !== dateTime) !== -1;
					}) === -1;
				}
			}

			return result;
		}
	);
});

/**
 * Валидация атрибута с учетом вложенности (ссылочного атрибута)
 * @param {Attribute} value - атрибут
 * @returns {boolean}
 */
const validateAttribute = (value: Attribute | null) => {
	let attribute = value;

	if (attribute && attribute.type in ATTRIBUTE_SETS.REFERENCE) {
		attribute = attribute.ref;
	}

	return isObject(attribute);
};

/**
 * Базовые правила валидации всех виджетов
 */
const base = {
	[FIELDS.header]: object({
		[FIELDS.template]: string().when(FIELDS.useName, {
			is: false,
			then: string().required(getErrorMessage(FIELDS.diagramName))
		})
	}),
	[FIELDS.templateName]: lazy((value: string, context: Object) => string().test(
		'name-rule',
		`Виджет с названием "${value}" не может быть сохранен. Название виджета должно быть уникально в рамках дашборда`,
		name => context.widgets.findIndex(widget => widget.name === name) === -1
	).required(getErrorMessage(FIELDS.name)))
};

/**
 * Правило для разбивки вычисляемого атрибута
 * @param {any} value - значение разбивки
 * @returns {object}
 */
const computedBreakdownRule = (value: any = []) => lazy((attribute: Attribute | null, ctx: Object) => {
	const {parent} = ctx;
	const rule = mixed().requiredAttribute(getErrorMessage(FIELDS.breakdown));

	if (Array.isArray(value) && parent === value[0]) {
		rule.group();
	}

	return rule;
});

/**
 * Правило для валидации разбивки
 * @returns {object}
 */
const requiredBreakdown = lazy((value: mixed, context: Object) => {
	const {attribute} = context.parent.indicators[0];

	if (attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
		return array().of(object({value: computedBreakdownRule(value)}));
	}

	return mixed().requiredAttribute(getErrorMessage(FIELDS.breakdown)).default(getDefaultParameter());
});

/**
 * Правило для валидации параметра
 */
const parameter = lazy((parameter: Parameter, options: Object) => {
	const {data} = options.values;
	const rule = mixed().requiredAttribute(getErrorMessage(FIELDS.parameter));

	if (data[0].parameters[0] === parameter) {
		rule.group();
	}

	return rule;
});

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @returns {object}
 */
const conditionalBreakdown = mixed().when([FIELDS.withBreakdown, FIELDS.breakdown], {
	is: (withBreakdown, breakdown) => Boolean(withBreakdown || breakdown),
	then: requiredBreakdown
});

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {object} rule - правило
 * @returns {object}
 */
const requiredByCompute = (rule: Object) => {
	return mixed().when(FIELDS.source, {
		is: ({forCompute}: SourceData) => !forCompute,
		then: rule
	}).nullable();
};

const validateTopSettings = object({
	count: number().required('Укажите значение ТОП').typeError('Значение ТОП должно быть числом')
}).default(DEFAULT_TOP_SETTINGS);

const rules = {
	base,
	conditionalBreakdown,
	parameter,
	requiredBreakdown,
	requiredByCompute,
	validateTopSettings
};

export {
	getErrorMessage,
	rules,
	mixed
};
