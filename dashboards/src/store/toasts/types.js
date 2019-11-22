// @flow
import {TOASTS_EVENTS} from './constants';

export type ToastPosition =
	| 'bottomLeft'
	| 'bottomRight'
	| 'topLeft'
	| 'topRight'
;

export type ToastType =
	| 'error'
	| 'info'
	| 'success'
;

export type NewToast = {
	position?: ToastPosition,
	text: string,
	time?: number,
	type?: ToastType
}

export type Toast = {
	id: string,
	position: ToastPosition,
	text: string,
	time: number,
	type: ToastType
};

export type ToastMap = {
	[string]: Toast
}

type AddToast = {
	type: typeof TOASTS_EVENTS.ADD_TOAST,
	payload: Toast
};

type RemoveToast = {
	type: typeof TOASTS_EVENTS.REMOVE_TOAST,
	payload: string
};

type UnknownToastsAction = {
	type: typeof TOASTS_EVENTS.UNKNOWN_TOASTS_ACTION
};

export type ToastsAction =
	| AddToast
	| RemoveToast
	| UnknownToastsAction
;

export type ToastsState = ToastMap;
