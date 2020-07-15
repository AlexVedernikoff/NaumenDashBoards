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
	payload,
	type: TOASTS_EVENTS.REMOVE_TOAST
});

const addToast = (payload: Toast) => ({
	payload,
	type: TOASTS_EVENTS.ADD_TOAST
});

export {
	createToast,
	removeToast
};
