// @flow
import type {ComboIndicatorSettings} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: ComboIndicatorSettings,
	name: string,
	onChange: (name: string, data: ComboIndicatorSettings) => void
};
