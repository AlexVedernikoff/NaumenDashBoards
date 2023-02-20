// @flow
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';

const baseDataSchema = {
	indicators: mixed().requiredByCompute(array().indicators()),
	parameters: mixed().requiredByCompute(array().parameters()),
	source: object().source(),
	top: object().topSettings()
};

export const schema = object({
	...baseSchema,
	data: array().of(object({
		...baseDataSchema,
		breakdown: mixed().requiredByCompute(array().conditionalBreakdown())
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});

export const schemaStacked = object({
	...baseSchema,
	data: array().of(object({
		...baseDataSchema,
		breakdown: mixed().requiredByCompute(array().breakdown())
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});
