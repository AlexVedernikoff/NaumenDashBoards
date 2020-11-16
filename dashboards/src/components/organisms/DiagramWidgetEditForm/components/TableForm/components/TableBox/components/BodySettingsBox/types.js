// @flow
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';
import type {TableBodySettings} from 'store/widgets/data/types';

export type Props = {
	...StyleBuilderProps,
	data: TableBodySettings,
	name: string,
	onChange: (name: string, settings: TableBodySettings) => void
};
