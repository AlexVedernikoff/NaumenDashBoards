// @flow
import type {AlertDialogOptions, CommonDialog, ConfirmDialogOptions} from 'store/commonDialogs/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	alertModal: ?CommonDialog,
	confirmModal: ?CommonDialog,
};

export type ConnectedFunctions = {
	closeAlert: () => ThunkAction,
	closeConfirmDialog: (status: boolean) => ThunkAction,
	confirmDialog: (header: string, text: string) => ThunkAction,
	showAlert: (header: string, text: string) => ThunkAction,
};

export type DispatchConnectedFunctions = {
	closeAlert: () => void,
	closeConfirmDialog: (status: boolean) => void,
	confirmDialog: (header: string, text: string) => Promise<boolean>,
	showAlert: (header: string, text: string) => Promise<void>,
};

export type OwnProps = {
	children: React$Node,
};

export type InternalProps = OwnProps & ConnectedProps & DispatchConnectedFunctions;

export type CommonDialogContextProps = {
	alert: (header: string, text: string, option?: $Shape<AlertDialogOptions>) => Promise<void>,
	confirm: (header: string, text: string, option?: $Shape<ConfirmDialogOptions>) => Promise<boolean>,
};
