// @flow
import type {AxisIndicator} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: AxisIndicator,
	name: string,
	onChange: (name: string, data: AxisIndicator) => void
};
