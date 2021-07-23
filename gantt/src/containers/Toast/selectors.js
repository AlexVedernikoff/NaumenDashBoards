// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {removeToast} from 'store/toasts/actions';

export const props = (state: AppState): ConnectedProps => ({
	toasts: state.toasts
});

export const functions: ConnectedFunctions = {
	removeToast
};
