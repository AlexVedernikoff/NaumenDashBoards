// @flow
import type {AutoChartColorsSettings} from 'store/widgets/data/types';
import type {EditPanelPosition} from 'store/dashboard/settings/types';

export type Props = {
	onChange: (settings: AutoChartColorsSettings) => void,
	position: EditPanelPosition,
	value: AutoChartColorsSettings
};

export type State = {
	colorIndex: number,
	showPicker: boolean
};
