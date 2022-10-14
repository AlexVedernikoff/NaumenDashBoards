// @flow
import {DEFAULT_TOAST, TOASTS_EVENTS} from './constants';
import type {Dispatch} from 'store/types';
import type {DivRef} from 'components/types';
import type {NewToast, Toast} from './types';
import uuid from 'tiny-uuid';

const createToast = (newToast: $Exact<NewToast>, relativeElement?: DivRef) => (dispatch: Dispatch) => {
	const toast = {...DEFAULT_TOAST, ...newToast, id: uuid()};

	if (relativeElement?.current) {
		const {top} = relativeElement.current.getBoundingClientRect();

		toast.position = 'byElement';
		toast.topOffset = top;
	}

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
