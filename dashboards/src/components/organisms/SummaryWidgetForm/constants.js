// @flow
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';

const DEFAULT_LAYOUT_SIZE = {
	height: 150,
	width: 250
};

const schema = object({
	...baseSchema,
	data: array().of(object({
		indicators: mixed().requiredByCompute(array().indicators()),
		source: mixed().source()
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});

export {
	DEFAULT_LAYOUT_SIZE,
	schema
};
