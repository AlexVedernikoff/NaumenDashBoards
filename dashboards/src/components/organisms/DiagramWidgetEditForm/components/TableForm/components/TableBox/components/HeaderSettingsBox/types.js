// @flow
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';
import type {TableHeaderSettings} from 'store/widgets/data/types';

export type Props = {
	...StyleBuilderProps,
	data: TableHeaderSettings,
	label: string,
	name: string,
	onChange: (name: string, settings: TableHeaderSettings) => void
};
