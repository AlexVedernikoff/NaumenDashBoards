// @flow
import type {CustomBreakdownChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	onChange: (settings: CustomBreakdownChartColorsSettings) => void,
	value: CustomBreakdownChartColorsSettings
};

export type State = {
	options: Array<string>
};
