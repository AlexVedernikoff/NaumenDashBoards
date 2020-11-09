// @flow
import type {DataLabels} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: DataLabels,
	name: string,
	onChange: (name: string, data: DataLabels) => void
};
