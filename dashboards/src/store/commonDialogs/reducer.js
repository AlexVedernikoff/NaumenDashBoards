// @flow
import type {CommonDialogActions, CommonDialogsState} from './types';
import {COMMON_DIALOG_EVENTS} from './constants';
import {defaultCommonDialogAction, initialCommonDialogsState} from './init';

const reducer = (state: CommonDialogsState = initialCommonDialogsState, action: CommonDialogActions = defaultCommonDialogAction): CommonDialogsState => {
	switch (action.type) {
		case COMMON_DIALOG_EVENTS.SHOW_CONFIRM_DIALOG:
			return {...state, ConfirmModal: action.payload};
		case COMMON_DIALOG_EVENTS.SHOW_ALERT:
			return {...state, AlertModal: action.payload};
		case COMMON_DIALOG_EVENTS.CLOSE_CONFIRM_DIALOG:
			return {...state, ConfirmModal: null};
		case COMMON_DIALOG_EVENTS.CLOSE_ALERT:
			return {...state, AlertModal: null};
		default:
			return state;
	}
};

export default reducer;
