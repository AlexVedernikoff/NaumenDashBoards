// @flow
import type {AnyWidget, ChartColorsSettings, SetUseGlobalChartSettings} from 'store/widgets/data/types';
import type {SaveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

export type ConnectedFunctions = {
	saveCustomChartColorsSettings: SaveCustomChartColorsSettings,
	setUseGlobalChartSettings: SetUseGlobalChartSettings
};

export type InjectedProps = {|
	applyNewColorsSettings: (prevSettings: ChartColorsSettings, settings: ChartColorsSettings) => ChartColorsSettings;
	saveCustomColorsSettings: (widget: AnyWidget) => void
|};

export type Props = $Exact<ConnectedFunctions>;
