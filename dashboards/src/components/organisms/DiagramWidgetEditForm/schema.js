// @flow
import {array, lazy, mixed, object, string} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';

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

	return !!attribute;
};

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
 * Добавляет правило валидации с учетом возможности использования группировки относительно других наборов данных
 * @param {object} rule - основное правило
 * @param {string} field - наименование поля атрибута
 * @param {Array<object>} data - набор данных, относительно которого проверяется возможность использования текущей группировки
 * @param {object} parent - объект данных, в контексте которого находится атрибут
 * @returns {object}
 */
const mixinGroupRule = (rule: Object, field, data: Array<Object>, parent) => rule.test(
	'grouped-attribute',
	'Группировка данного атрибута не применима к другим полям',
	attribute => {
		const {DAY, HOURS, MINUTES} = DATETIME_SYSTEM_GROUP;
		const {dateTime} = ATTRIBUTE_TYPES;
		const isMain = parent === data[0];
		const group = parent[FIELDS.group];

		if (isMain && attribute && attribute.type === dateTime && group.way === GROUP_WAYS.SYSTEM) {
			const {data: groupData, format} = group;
			const useTime = groupData === HOURS || groupData === MINUTES || (groupData === DAY && format && format.includes('hh'));

			if (useTime) {
				return data.findIndex(set => set[field] && set[field].type !== ATTRIBUTE_TYPES.dateTime) === -1;
			}
		}

		return true;
	}
);

/**
 * Правило для параметров
 * @param {string} field - наименование поля параметра
 * @returns {object}
 */
const parameterRule = (field: string) => lazy((attribute: Attribute | null, ctx: Object) => {
	const {parent, values} = ctx;
	const {data} = values;
	const isMain = parent === data[0];
	const rule = requiredAttribute(getErrorMessage(field));

	return isMain ? mixinGroupRule(rule, field, data, parent) : rule;
});

/**
 * Правило для разбивки вычисляемого атрибута
 * @param {any} value - значение разбивки
 * @returns {object}
 */
const computedBreakdownRule = (value: any) => lazy((attribute: Attribute | null, ctx: Object) => {
	const {parent} = ctx;
	let data = value;

	if (!Array.isArray(data)) {
		data = [];
	}

	const isMain = parent === data[0];
	const rule = requiredAttribute(getErrorMessage(FIELDS.breakdown));

	return isMain ? mixinGroupRule(rule, FIELDS.value, data, parent) : rule;
});

/**
 * Правило для валидации разбивки
 * @param {string} indicatorName - наименование поля индикатора
 * @returns {object}
 */
const requiredBreakdown = (indicatorName: string) => lazy((value: mixed, context: Object) => {
	const indicator = context.parent[indicatorName];

	if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
		return array().of(object({
			value: computedBreakdownRule(value)
		}));
	}

	return requiredAttribute(getErrorMessage(FIELDS.breakdown));
});

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @param {string} indicatorName - наименование поля индикатора
 * @returns {object}
 */
const conditionalBreakdown = (indicatorName: string) => mixed().when([FIELDS.withBreakdown, FIELDS.breakdown], {
	is: (withBreakdown, breakdown) => Boolean(withBreakdown || breakdown),
	then: requiredBreakdown(indicatorName)
});

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {string} key - название поля
 * @param {object} rule - правило
 * @returns {object}
 */
const requiredByCompute = (key: string, rule: Object) => {
	let computeRule = rule;

	if (!computeRule) {
		computeRule = requiredAttribute(getErrorMessage(key));
	}

	return mixed().when(FIELDS.sourceForCompute, {
		is: false,
		then: computeRule
	}).nullable();
};

const validateSources = mixed().when(FIELDS.data, {
		is: data => data.length > 1,
		then: mixed().test(
			'check-sources-number',
			'Для данного типа диаграммы источник может быть один, дополнительные можно использовать для вычисления',
			function () {
				const {data} = this.options.parent;
				return data.filter(dataSet => !dataSet.sourceForCompute).length === 1;
		})
	}
);

const rules = {
	base,
	conditionalBreakdown,
	parameterRule,
	requiredAttribute,
	requiredBreakdown,
	requiredByCompute,
	validateSources
};

export {
	getErrorMessage,
	rules
};
