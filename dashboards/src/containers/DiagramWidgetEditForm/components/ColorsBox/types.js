// @flow
import type {DiagramBuildData} from 'src/store/widgets/buildData/types';
import type {Props as ComponentProps} from 'DiagramWidgetEditForm/components/ColorsBox/types';
import type {RemoveCustomChartColorsSetting, State} from 'store/dashboard/customChartColorsSettings/types';
import type {SetUseGlobalChartSettings, Widget} from 'store/widgets/data/types';
import type {Values} from 'src/containers/WidgetEditForm/types';

export type ConnectedProps = {|
	buildData: DiagramBuildData | null,
	customChartColorsSettings: State
|};

export type ConnectedFunctions = {
	removeCustomChartColorsSettings: RemoveCustomChartColorsSetting,
	setUseGlobalChartSettings: SetUseGlobalChartSettings
};

export type ContainerProps = {
	values: Values,
	widget: Widget
};

export type Props = ComponentProps & ContainerProps & ConnectedProps & ConnectedFunctions;
