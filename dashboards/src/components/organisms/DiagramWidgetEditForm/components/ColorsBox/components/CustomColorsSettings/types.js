// @flow
import type {CustomChartColorsSettings} from 'src/store/widgets/data/types';

export type Props = {
	defaultColors: Array<string>,
	labels?: Array<string>,
	onChange: (value: CustomChartColorsSettings) => void,
	value: CustomChartColorsSettings
};
