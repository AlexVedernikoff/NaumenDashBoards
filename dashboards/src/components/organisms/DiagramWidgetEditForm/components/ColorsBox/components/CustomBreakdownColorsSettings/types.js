// @flow
import type {CustomBreakdownChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	defaultColors: Array<string>,
	labels: Array<string>,
	onChange: (settings: CustomBreakdownChartColorsSettings) => void,
	value: CustomBreakdownChartColorsSettings
};

export type State = {
	colors: Array<string>
};
