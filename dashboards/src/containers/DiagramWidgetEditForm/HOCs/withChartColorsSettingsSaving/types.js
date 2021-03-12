// @flow
import type {AnyWidget, SetUseGlobalChartSettings} from 'store/widgets/data/types';
import type {SaveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

export type ConnectedFunctions = {
	saveCustomChartColorsSettings: SaveCustomChartColorsSettings,
	setUseGlobalChartSettings: SetUseGlobalChartSettings
};

export type InjectedProps = {|
	saveCustomColorsSettings: (widget: AnyWidget) => void
|};

export type Props = $Exact<ConnectedFunctions>;