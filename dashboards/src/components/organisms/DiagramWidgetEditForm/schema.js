// @flow
import {addMethod, array, lazy, mixed, number, object, string} from 'yup';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem, Parameter, SourceData} from 'containers/DiagramWidgetEditForm/types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
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

/**
 * Правило валидации атрибута только в случае если источник не для вычислений
 * @param {object} rule - правило
 * @returns {object}
 */
addMethod(mixed, 'requiredByCompute', function (schema) {
	return this.when(FIELDS.source, {
		is: ({forCompute}: SourceData) => !forCompute,
		then: schema
	});
});

addMethod(mixed, 'requiredAttribute', function (text: string) {
	return this.test(
		'check-attribute',
		text,
		({attribute: value} = {}) => {
			let attribute = value;

			if (attribute && attribute.type in ATTRIBUTE_SETS.REFERENCE) {
				attribute = attribute.ref;
			}

			return isObject(attribute);
		}
	);
});

addMethod(mixed, 'group', function () {
	return this.test(
		'check-attribute-group',
		'Группировка данного атрибута не применима к другим полям',
		function (attributeData: Parameter | BreakdownItem) {
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

addMethod(object, 'topSettings', function () {
	return this.shape({
		count: number().required('Укажите значение ТОП').typeError('Значение ТОП должно быть числом')
	}).default(DEFAULT_TOP_SETTINGS);
});

addMethod(array, 'parameters', function () {
	return this.of(lazy((parameter: Parameter, options: Object) => {
		const {data} = options.values;
		const schema = mixed().requiredAttribute(getErrorMessage(FIELDS.parameter));

		return data[0].parameters[0] === parameter ? schema.group() : schema;
	}));
});

addMethod(array, 'indicators', function () {
	return this.of(mixed().requiredAttribute(getErrorMessage(FIELDS.indicator)));
});

addMethod(array, 'breakdown', function () {
	return this.of(lazy((item: BreakdownItem, options: Object) => {
		const {parent} = options;
		const schema = mixed().requiredAttribute(getErrorMessage(FIELDS.breakdown));

		return parent[0] === item ? schema.group() : schema;
	}));
});

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @returns {object}
 */
addMethod(array, 'conditionalBreakdown', function () {
	return this.when([FIELDS.withBreakdown, FIELDS.breakdown], {
		is: (withBreakdown, breakdown) => Boolean(withBreakdown || breakdown),
		then: array().breakdown()
	});
});

/**
 * Базовые правила валидации всех виджетов
 */
const baseSchema = {
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

export {
	array,
	baseSchema,
	getErrorMessage,
	object,
	mixed
};
