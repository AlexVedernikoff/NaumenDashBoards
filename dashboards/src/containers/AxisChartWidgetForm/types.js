// @flow
import type {AxisWidget, AxisWidgetType, Widget} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {State as AxisChartForm, Values} from 'store/widgetForms/axisChartForm/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	values: AxisChartForm
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onSave: (widget: AxisWidget) => ThunkAction
};

export type Props = {
	type: AxisWidgetType,
	widget: Widget | NewWidget
} & ConnectedProps & ConnectedFunctions;
