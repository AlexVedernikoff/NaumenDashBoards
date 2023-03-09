// @flow
import type {CustomGroupsMap} from 'store/customGroups/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SortingBox/types';
import type {State as AxisChartForm} from 'store/widgetForms/axisChartForm/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	values: AxisChartForm
};

export type Props = ComponentProps & ConnectedProps;
