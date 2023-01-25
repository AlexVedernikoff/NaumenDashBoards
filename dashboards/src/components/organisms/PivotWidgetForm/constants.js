// @flow
import {addMethod, boolean, lazy, string} from 'yup';
import {array, baseSchema, mixed, object} from 'src/containers/DiagramWidgetForm/schema';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {Parameter} from 'store/widgetForms/types';
import t from 'localization';

addMethod(array, 'singlePivotParams', function () {
	return this.of(
		lazy(() => mixed().test(
			'check-single-attribute-use-in-parameter',
			t('TableWidgetForm::Scheme::DoubleAttribute'),
			function (parameter: Parameter) {
				const {parent: parameters} = this;

				return parameters.every((item: Parameter) => (
					item === parameter
					|| item.attribute?.code !== parameter.attribute?.code
					|| item.attribute?.sourceCode !== parameter.attribute?.sourceCode
					|| item.group?.way !== parameter.group?.way
				));
			}
		))
	);
});

const indicatorGrouping = object({
	children: array().nullable().of(lazy(() => indicatorGrouping)),
	hasSum: boolean(),
	key: string().required(),
	label: string().required(),
	type: string().required()
});

const sourceLinks = object({
	attribute: mixed().required(),
	dataKey1: string().required(),
	dataKey2: string().required()
});

const parametersOrder = object({
	dataKey: string().required(),
	parameter: object().required()
});

const schema = object({
	...baseSchema,
	data: array().of(object({
		indicators: mixed().requiredByCompute(array().indicators(false)),
		parameters: mixed().requiredByCompute(array().parameters(false).singlePivotParams()),
		source: object().source()
	})),
	indicatorGrouping: array().nullable().of(indicatorGrouping),
	links: array().nullable().of(sourceLinks),
	parametersOrder: array().nullable().of(parametersOrder),
	sources: mixed().minSourceNumbers()
});

export {
	schema,
	DIAGRAM_FIELDS
};
