// @flow
import {DEFAULT_TOAST, TOASTS_EVENTS} from './constants';
import type {Dispatch} from 'store/types';
import type {NewToast, Toast} from './types';
import uuid from 'tiny-uuid';

const createToast = (newToast: $Exact<NewToast>) => (dispatch: Dispatch) => {
	const toast = {...DEFAULT_TOAST, ...newToast, id: uuid()};
	dispatch(addToast(toast));
};

const removeToast = (payload: string) => (dispatch: Dispatch) => dispatch({
	type: TOASTS_EVENTS.REMOVE_TOAST,
	payload
});

const addToast = (payload: Toast) => ({
	type: TOASTS_EVENTS.ADD_TOAST,
	payload
});

export {
	createToast,
	removeToast
};
