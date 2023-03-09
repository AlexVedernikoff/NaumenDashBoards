// @flow
import type {CustomGroupsMap} from 'store/customGroups/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SortingBox/types';
import type {State as ComboChartForm} from 'store/widgetForms/comboChartForm/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	values: ComboChartForm
};

export type Props = ComponentProps & ConnectedProps;
