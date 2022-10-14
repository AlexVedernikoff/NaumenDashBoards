// @flow
import {TOASTS_EVENTS} from './constants';

export type ToastPosition =
	| 'byElement'
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
};

export type Toast = {
	id: string,
	position: ToastPosition,
	text: string,
	time: number,
	topOffset?: number,
	type: ToastType
};

export type ToastMap = {
	[string]: Toast
};

type AddToast = {
	payload: Toast,
	type: typeof TOASTS_EVENTS.ADD_TOAST
};

type RemoveToast = {
	payload: string,
	type: typeof TOASTS_EVENTS.REMOVE_TOAST
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
