// @flow
import type {CustomLabelChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	labels: Array<string>,
	onChange: (settings: CustomLabelChartColorsSettings) => void,
	value: CustomLabelChartColorsSettings
};

export type State = {
	options: Array<string>
};
