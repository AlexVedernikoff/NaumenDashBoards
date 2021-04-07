// @flow
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';

export type Props = {
	defaultColors: Array<string>,
	labels: Array<string>,
	onChange: (value: CustomChartColorsSettingsData) => void,
	value: CustomChartColorsSettingsData
};
