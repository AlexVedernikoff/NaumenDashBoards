// @flow
import type {AppState} from 'store/types';
import {closeAlert, closeConfirmDialog, confirmDialog, showAlert} from 'store/commonDialogs/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => ({
	alertModal: state.commonDialogs.AlertModal,
	confirmModal: state.commonDialogs.ConfirmModal
});

export const functions: ConnectedFunctions = {
	closeAlert,
	closeConfirmDialog,
	confirmDialog,
	showAlert
};
