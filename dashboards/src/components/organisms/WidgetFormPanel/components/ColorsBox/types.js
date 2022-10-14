// @flow
import type {ChartColorsSettings} from 'store/widgets/data/types';
import type {EditPanelPosition} from 'store/dashboard/settings/types';

export type Props = {
	disabledCustomSettings: boolean,
	isChanged: boolean,
	labels: Array<string>,
	name: string,
	onChange: (name: string, value: any) => void,
	onClear: () => void,
	position: EditPanelPosition,
	usesBreakdownCustomSettings: boolean,
	value: ChartColorsSettings
};
