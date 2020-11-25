// @flow
import type {ComboIndicatorSettings} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';
import type {Values} from 'containers/WidgetEditForm/types';

export type Props = {
	...StyleBuilderProps,
	data: ComboIndicatorSettings,
	name: string,
	onChange: (name: string, data: ComboIndicatorSettings) => void,
	onChangeDataSet: (index: number, name: string, value: any) => void,
	values: Values
};

export type State = {
	showAdditionalSettings: boolean
};
