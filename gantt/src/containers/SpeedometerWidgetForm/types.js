// @flow
import type {SpeedometerWidget, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {Values} from 'store/widgetForms/speedometerForm/types';

export type ConnectedProps = {
	values: Values,
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onSave: (widget: SpeedometerWidget) => ThunkAction
};

export type Props = {
	widget: Widget
} & ConnectedProps & ConnectedFunctions;
