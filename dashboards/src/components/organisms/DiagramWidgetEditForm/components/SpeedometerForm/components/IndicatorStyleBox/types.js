// @flow
import type {SpeedometerIndicatorSettings} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: SpeedometerIndicatorSettings,
	name: string,
	onChange: (name: string, data: SpeedometerIndicatorSettings) => void
};
