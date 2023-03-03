// @flow
import {addMethod, boolean, lazy, string} from 'yup';
import {array, baseSchema, mixed, object} from 'src/containers/DiagramWidgetForm/schema';
import type {DataSet as PivotDataSet} from 'store/widgetForms/pivotForm/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {Parameter} from 'store/widgetForms/types';
import type {PivotLink} from 'store/widgets/data/types';
import t from 'localization';

addMethod(array, 'singlePivotParams', function () {
	return this.of(
		lazy(() => mixed().test(
			'check-single-attribute-use-in-parameter',
			t('TableWidgetForm::Scheme::DoubleAttribute'),
			function (parameter: Parameter) {
				const {parent: parameters} = this;

				return parameters.every((item: Parameter) => {
					let result = true;

					if (item !== parameter) {
						const itemAttribute = item.attribute?.ref ? item.attribute.ref : item.attribute;
						const parameterAttribute = parameter.attribute?.ref
							? parameter.attribute.ref
							: parameter.attribute;

						result = itemAttribute?.code !== parameterAttribute?.code
						|| itemAttribute?.sourceCode !== parameterAttribute?.sourceCode
						|| item.group?.way !== parameter.group?.way;
					}

					return result;
				});
			}
		))
	);
});

addMethod(array, 'sourceLinks', function () {
	return lazy(() => array().of(sourceLinks).test(
		'check-source-links-for-all-sources',
		t('PivotWidgetScheme::CheckSourceLinksForAllSources'),
		function (sourceLinks: Array<PivotLink>) {
			const result: Array<string> = [];
			const {parent: {data}} = this;
			const pivotData = (data: Array<PivotDataSet>);
			const sourceLinksKeys = sourceLinks.flatMap(({dataKey1, dataKey2}) => [dataKey1, dataKey2]);
			const dataKeysSet = new Set(sourceLinksKeys);

			pivotData.forEach(dataSet => {
				if (!dataKeysSet.has(dataSet.dataKey)) {
					result.push(dataSet.source.value?.label ?? '');
				}
			});

			if (result.length > 1) {
				const message = t('PivotWidgetScheme::CheckSourceLinksForAllSources', {
					sources: result.join(', ')
				});

				return this.createError({message});
			}

			return true;
		}
	));
});

const indicatorGrouping = object({
	children: array().nullable().of(lazy(() => indicatorGrouping)),
	hasSum: boolean(),
	key: string().required(),
	label: string().required(t('PivotWidgetScheme::SetNameGroup')),
	type: string().required()
});

const sourceLinks = object({
	attribute: mixed().required(t('PivotWidgetScheme::SetLinkAttribute')),
	dataKey1: string().required(t('PivotWidgetScheme::SetLinkDataKey1')),
	dataKey2: string().required(t('PivotWidgetScheme::SetLinkDataKey2'))
});

const parametersOrder = object({
	dataKey: string().required(),
	parameter: object().required()
});

const pivotIndicators = object({
	aggregation: string().required(),
	attribute: mixed().required(t('PivotWidgetScheme::SetIndicatorAttribute')),
	breakdown: mixed().when({
		is: value => !!value,
		then: object({
			attribute: mixed().required(t('PivotWidgetScheme::SetBreakdownAttribute')),
			dataKey: string().required(),
			group: object({
				data: string().required(),
				way: string().required()
			})
		})
	}),
	descriptor: string().nullable(),
	key: string().required()
});

const schema = object({
	...baseSchema,
	data: array().of(object({
		indicators: mixed().requiredByCompute(array().of(pivotIndicators)),
		parameters: mixed().requiredByCompute(array().parameters(false).singlePivotParams()),
		source: object().source()
	})),
	indicatorGrouping: array().nullable().of(indicatorGrouping),
	links: array().sourceLinks(),
	parametersOrder: array().nullable().of(parametersOrder),
	sources: mixed().minSourceNumbers()
});

export {
	schema,
	DIAGRAM_FIELDS
};
