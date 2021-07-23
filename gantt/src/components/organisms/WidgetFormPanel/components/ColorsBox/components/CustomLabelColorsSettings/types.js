// @flow
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';

export type Props = {
	labels: Array<string>,
	onChange: (value: CustomChartColorsSettingsData) => void,
	value: CustomChartColorsSettingsData
};

export type State = {
	options: Array<string>
};
