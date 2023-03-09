// @flow
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SortingBox/types';
import type {State as CircleChartForm} from 'store/widgetForms/circleChartForm/types';

export type ConnectedProps = {
	values: CircleChartForm
};

export type Props = ComponentProps & ConnectedProps;
