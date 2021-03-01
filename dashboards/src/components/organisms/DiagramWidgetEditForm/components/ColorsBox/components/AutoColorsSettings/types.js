// @flow
import type {AutoChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	onChange: (settings: AutoChartColorsSettings) => void,
	value: AutoChartColorsSettings
};

export type State = {
	colorIndex: number,
	showPicker: boolean
};
