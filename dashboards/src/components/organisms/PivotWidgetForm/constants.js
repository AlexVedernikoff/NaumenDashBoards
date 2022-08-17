// @flow
import {array, baseSchema, mixed, object} from 'src/containers/DiagramWidgetForm/schema';
import {boolean, lazy, string} from 'yup';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';

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
		parameters: mixed().requiredByCompute(array().parameters(false)),
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
