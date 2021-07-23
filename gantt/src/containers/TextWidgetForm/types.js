// @flow
import type {TextWidget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {Values as StateValues} from 'store/widgetForms/textForm/types';

export type Values = StateValues;

export type ConnectedProps = {
	saving: boolean,
	values: Values
};

export type ConnectedFunctions = {
	changeValues: (values: Values) => ThunkAction,
	save: (widget: TextWidget) => ThunkAction
};

export type Props = {
	onCancel: () => ThunkAction,
	widget: TextWidget
} & ConnectedProps & ConnectedFunctions;
