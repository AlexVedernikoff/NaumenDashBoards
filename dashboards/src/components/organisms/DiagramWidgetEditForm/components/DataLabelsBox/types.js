// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataLabels} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...ContextProps,
	...StyleBuilderProps,
	data: DataLabels,
	name: string,
	onChange: (name: string, data: DataLabels) => void
};
