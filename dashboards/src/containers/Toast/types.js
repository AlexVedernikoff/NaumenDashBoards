// @flow
import type {ThunkAction} from 'store/types';
import type {ToastMap} from 'store/toasts/types';

export type ConnectedProps = {
	toasts: ToastMap
};

export type ConnectedFunctions = {
	removeToast: (id: string) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
