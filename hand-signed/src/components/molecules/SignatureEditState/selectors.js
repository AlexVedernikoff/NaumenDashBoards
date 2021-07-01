// @flow
import {addSignature, sendSignature} from 'store/signature/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (appState: AppState): ConnectedProps => {
	const {signature} = appState;
	const {data} = signature;

	return {
		data
	}
};

const functions: ConnectedFunctions = {
	addSignature,
	sendSignature
};

export {
	functions,
	props
};
