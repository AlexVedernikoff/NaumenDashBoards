// @flow
import type {DiagramData} from 'store/widgets/buildData/types';
import type {
	GlobalCustomChartColorsSettings,
	RemoveCustomChartColorsSettingAction
} from 'store/dashboard/customChartColorsSettings/types';
import type {InjectedProps} from 'WidgetFormPanel/HOCs/withType/types';
import type {InjectedProps as TypeInjectedProps} from 'components/organisms/WidgetFormPanel/HOCs/withType/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/ColorsBox/types';
import type {SetUseGlobalChartSettingsAction, Widget} from 'store/widgets/data/types';
import type {Values} from 'components/organisms/WidgetForm/types';

export type ConnectedProps = {|
	buildData?: DiagramData,
	globalColorsSettings: GlobalCustomChartColorsSettings
|};

export type ConnectedFunctions = {|
	removeCustomChartColorsSettings: RemoveCustomChartColorsSettingAction,
	setUseGlobalChartSettings: SetUseGlobalChartSettingsAction
|};

export type ContainerProps = InjectedProps & {|
	values: Values,
	widget: Widget
|};

export type State = {
	labels: Array<string>
};

export type OwnerProps = ComponentProps & TypeInjectedProps & ContainerProps;

export type Props = ConnectedProps & ConnectedFunctions & OwnerProps;
