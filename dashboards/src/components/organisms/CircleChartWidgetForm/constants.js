// @flow
import {array, baseSchema, mixed, object} from 'src/containers/DiagramWidgetForm/schema';

const schema = object({
	...baseSchema,
	data: array().of(object({
		breakdown: mixed().requiredByCompute(array().breakdown()),
		indicators: mixed().requiredByCompute(array().indicators()),
		source: object().source(),
		top: object().topSettings()
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});

export {
	schema
};
