// @flow
import type {CommonDialogActions, CommonDialogsState} from './types';
import {COMMON_DIALOG_EVENTS} from './constants';

export const initialCommonDialogsState: CommonDialogsState = {
	AlertModal: null,
	ConfirmModal: null
};

export const defaultCommonDialogAction: CommonDialogActions = {
	type: COMMON_DIALOG_EVENTS.UNKNOWN_COMMON_DIALOG_ACTION
};
