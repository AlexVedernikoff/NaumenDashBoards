// @flow
import type {CustomChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	defaultColors: Array<string>,
	labels: Array<string>,
	onChange: (value: CustomChartColorsSettings) => void,
	usesBreakdownSettings: boolean,
	value: CustomChartColorsSettings
};
