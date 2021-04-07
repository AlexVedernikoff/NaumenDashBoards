// @flow
import type {AnyWidget, CircleWidget, CircleWidgetType} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {Values} from 'store/widgetForms/circleChartForm/types';

export type ConnectedProps = {
	values: Values
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onSave: (widget: CircleWidget) => ThunkAction
};

export type Props = {
	type: CircleWidgetType,
	widget: AnyWidget
} & ConnectedProps & ConnectedFunctions;
