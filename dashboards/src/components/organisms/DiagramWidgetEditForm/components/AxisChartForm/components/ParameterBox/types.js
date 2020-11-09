// @flow
import type {AxisParameter} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: AxisParameter,
	name: string,
	onChange: (name: string, data: AxisParameter) => void
};
