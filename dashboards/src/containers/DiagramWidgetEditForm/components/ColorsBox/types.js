// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {Chart, SetUseGlobalChartSettings} from 'store/widgets/data/types';
import type {
	GlobalCustomChartColorsSettings,
	RemoveCustomChartColorsSetting
} from 'store/dashboard/customChartColorsSettings/types';
import type {Props as ComponentProps} from 'DiagramWidgetEditForm/components/ColorsBox/types';
import type {Values} from 'containers/WidgetEditForm/types';

export type ConnectedProps = {|
	buildData?: BuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
|};

export type ConnectedFunctions = {|
	removeCustomChartColorsSettings: RemoveCustomChartColorsSetting,
	setUseGlobalChartSettings: SetUseGlobalChartSettings
|};

export type ContainerProps = {|
	values: Values,
	widget: Chart
|};

export type State = {
	labels: Array<string>
};

export type Props = ConnectedProps & ComponentProps & ConnectedFunctions & ContainerProps;
