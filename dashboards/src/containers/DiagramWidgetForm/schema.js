// @flow
import {addMethod, array, boolean, lazy, mixed, number, object, string} from 'yup';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem, Parameter} from 'store/widgetForms/types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {getDefaultBreakdown} from 'store/widgetForms/helpers';
import t from 'localization';

const getErrorMessage = (key: string) => {
	const messages = {
		[DIAGRAM_FIELDS.breakdown]: t('DiagramWidgetForm::Scheme::EmptyBreakdown'),
		[DIAGRAM_FIELDS.diagramName]: t('DiagramWidgetForm::Scheme::EmptyDiagramName'),
		[DIAGRAM_FIELDS.indicator]: t('DiagramWidgetForm::Scheme::EmptyIndicator'),
		[DIAGRAM_FIELDS.name]: t('DiagramWidgetForm::Scheme::EmptyName'),
		[DIAGRAM_FIELDS.parameter]: t('DiagramWidgetForm::Scheme::EmptyParameter'),
		[DIAGRAM_FIELDS.source]: t('DiagramWidgetForm::Scheme::EmptySource')
	};

	return messages[key] || t('DiagramWidgetForm::Scheme::Error');
};

addMethod(mixed, 'sourceNumbers', function () {
	return this.test(
		'check-sources-number',
		t('DiagramWidgetForm::Scheme::CheckSourcesNumber'),
		function () {
			const {data} = this.options.parent;

			return data.filter(dataSet => !dataSet.sourceForCompute).length === 1;
		});
});

addMethod(mixed, 'singleSourceForCompute', function () {
	return this.test(
		'check-sources-number',
		t('DiagramWidgetForm::Scheme::SingleSourceForCompute'),
		function () {
			const {parent, values} = this.options;

			if (values && values.data.length > 1) {
				const mainSources = values.data.filter(item => !item.sourceForCompute).map(item => item.dataKey);

				if (mainSources.length > 1) {
					const unnecessarySources = mainSources.slice(1);
					return !unnecessarySources.includes(parent.dataKey);
				}
			}

			return true;
		});
});

addMethod(mixed, 'minSourceNumbers', function () {
	return this.test(
		'check-min-source-numbers',
		t('DiagramWidgetForm::Scheme::MinSourceNumbers'),
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
	return this.when(DIAGRAM_FIELDS.sourceForCompute, {
		is: false,
		then: schema
	});
});

addMethod(mixed, 'requiredAttribute', function (text: string) {
	return this.test(
		'check-attribute',
		text,
		({attribute}) => !!attribute
	);
});

addMethod(mixed, 'group', function (field: string = DIAGRAM_FIELDS.parameter) {
	return this.test(
		'check-attribute-group',
		t('DiagramWidgetForm::Scheme::CheckAttributeGroup'),
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
					const isDateTime = ({attribute}) => attribute && attribute.type === dateTime;
					const idx = data.slice(1).findIndex(({breakdown, parameters}) => {
						let result = false;

						if (field === DIAGRAM_FIELDS.parameter) {
							result = !parameters.every(isDateTime);
						} else if (field === DIAGRAM_FIELDS.breakdown) {
							result = breakdown && !breakdown.every(isDateTime);
						}

						return result;
					});

					result = idx === -1;
				}
			}

			return result;
		}
	);
});

addMethod(object, 'source', function () {
	return object({
		value: mixed().required(t('DiagramWidgetForm::Scheme::CheckSourceValue')),
		widgetFilterOptions: array().of(
			object({
				attributes: array().min(1, t('DiagramWidgetForm::Scheme::CheckSourceWidgetFilterAttributes')),
				label: string().required(t('DiagramWidgetForm::Scheme::CheckSourceWidgetFilterLabel'))
			})
		).nullable()
	}).required(t('DiagramWidgetForm::Scheme::CheckSourceValue'));
});

addMethod(object, 'topSettings', function () {
	return object({
		count: number().when(
			'show', {
				is: true,
				otherwise: number().typeError(t('DiagramWidgetForm::Scheme::TopSettings::TypeError')).nullable(),
				then: number()
					.required(t('DiagramWidgetForm::Scheme::TopSettings::Required'))
					.typeError(t('DiagramWidgetForm::Scheme::TopSettings::TypeError'))
			}
		),
		show: boolean()
	}).default(DEFAULT_TOP_SETTINGS);
});

addMethod(array, 'parameters', function () {
	return this.of(lazy((parameter: Parameter, options: Object) => {
		const {data} = options.values;
		const schema = mixed().requiredAttribute(getErrorMessage(DIAGRAM_FIELDS.parameter));

		return data[0].parameters[0] === parameter ? schema.group(DIAGRAM_FIELDS.parameter) : schema;
	}));
});

addMethod(array, 'indicators', function () {
	return this.of(mixed().requiredAttribute(getErrorMessage(DIAGRAM_FIELDS.indicator)));
});

addMethod(array, 'breakdown', function () {
	return this.of(lazy((item: BreakdownItem, options: Object) => {
		const {parent} = options;
		const schema = mixed().requiredAttribute(getErrorMessage(DIAGRAM_FIELDS.breakdown));

		return parent[0] === item ? schema.group(DIAGRAM_FIELDS.breakdown) : schema;
	})).default(getDefaultBreakdown(''));
});

/**
 * Правило валидации разбвивки в зависимости от ее динамического добавления
 * @returns {object}
 */
addMethod(array, 'conditionalBreakdown', function () {
	return this.when(DIAGRAM_FIELDS.breakdown, {
		is: breakdown => Array.isArray(breakdown),
		then: array().breakdown()
	});
});

/**
 * Базовые правила валидации всех виджетов
 */
const baseSchema = {
	[DIAGRAM_FIELDS.header]: object({
		[DIAGRAM_FIELDS.template]: string().when(DIAGRAM_FIELDS.useName, {
			is: false,
			then: string().required(getErrorMessage(DIAGRAM_FIELDS.diagramName))
		})
	}),
	[DIAGRAM_FIELDS.templateName]: lazy((value: string, context: Object) => string().test(
		'name-rule',
		t('DiagramWidgetForm::Scheme::UniqWidget', {name: value}),
		name => context.widgets.findIndex(widget => widget.name === name) === -1
	).required(getErrorMessage(DIAGRAM_FIELDS.name)))
};

export {
	array,
	baseSchema,
	getErrorMessage,
	object,
	mixed
};
