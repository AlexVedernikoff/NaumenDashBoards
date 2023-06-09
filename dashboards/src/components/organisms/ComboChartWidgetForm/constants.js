// @flow
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';

const schema = object({
	...baseSchema,
	data: array().of(object({
		breakdown: mixed().when(DIAGRAM_FIELDS.type, {
			/* eslint-disable sort-keys, sort-keys-fix/sort-keys-fix */
			is: type => type === COMBO_TYPES.COLUMN_STACKED,
			then: array().breakdown(false),
			otherwise: mixed().requiredByCompute(array().conditionalBreakdown(false))
			/* eslint-enable */
		}),
		indicators: mixed().requiredByCompute(array().indicators(false)),
		parameters: mixed().requiredByCompute(array().parameters(false)),
		source: object().source(),
		top: object().topSettings()
	})),
	sources: mixed().minSourceNumbers()
});

export {
	schema
};
