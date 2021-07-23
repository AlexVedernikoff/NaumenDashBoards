// @flow
import type {Toast} from './types';

const ADD_TOAST: 'ADD_TOAST' = 'ADD_TOAST';
const REMOVE_TOAST: 'REMOVE_TOAST' = 'REMOVE_TOAST';
const UNKNOWN_TOASTS_ACTION: 'UNKNOWN_TOASTS_ACTION' = 'UNKNOWN_TOASTS_ACTION';

const TOASTS_EVENTS = {
	ADD_TOAST,
	REMOVE_TOAST,
	UNKNOWN_TOASTS_ACTION
};

const DEFAULT_TOAST: Toast = {
	id: '',
	position: 'topRight',
	text: '',
	time: 3000,
	type: 'success'
};

export {
	DEFAULT_TOAST,
	TOASTS_EVENTS
};
