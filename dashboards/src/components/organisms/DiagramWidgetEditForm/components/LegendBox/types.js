// @flow
import type {Legend} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: Legend,
	name: string,
	onChange: (name: string, data: Legend) => void
};
