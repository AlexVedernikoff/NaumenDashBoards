// @flow
import NewWidget from 'store/widgets/data/NewWidget';
import type {PivotWidget, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {Values} from 'store/widgetForms/pivotForm/types';

export type ConnectedProps = {
	values: Values
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onSave: (widget: PivotWidget) => ThunkAction
};

export type Props = {
	widget: Widget | NewWidget
} & ConnectedProps & ConnectedFunctions;
