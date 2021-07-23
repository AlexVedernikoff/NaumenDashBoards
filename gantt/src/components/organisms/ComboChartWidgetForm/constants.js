// @flow
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';

const schema = object({
	...baseSchema,
	data: array().of(object({
		breakdown: mixed().when(DIAGRAM_FIELDS.type, {
			else: mixed().requiredByCompute(array().conditionalBreakdown()),
			is: type => type === COMBO_TYPES.COLUMN_STACKED,
			then: array().breakdown()
		}),
		indicators: mixed().requiredByCompute(array().indicators()),
		parameters: array().parameters(),
		source: mixed().source(),
		top: object().topSettings()
	})),
	sources: mixed().minSourceNumbers()
});

export {
	schema
};
