// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {NewToast} from 'store/toasts/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	widget: AnyWidget
};

export type ConnectedFunctions = {
	cancelForm: () => ThunkAction,
	createToast: (newToast: $Exact<NewToast>) => ThunkAction,
	resetForm: () => ThunkAction,
	setWidgetValues: (widget: AnyWidget) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
