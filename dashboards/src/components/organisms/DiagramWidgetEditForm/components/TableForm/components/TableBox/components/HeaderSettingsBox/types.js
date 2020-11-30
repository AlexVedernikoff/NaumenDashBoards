// @flow
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';
import type {TableHeaderSettings} from 'store/widgets/data/types';

export type Props = {
	...StyleBuilderProps,
	data: TableHeaderSettings,
	onChange: TableHeaderSettings => void
};
