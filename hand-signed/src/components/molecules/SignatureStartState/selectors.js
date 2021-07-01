// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setNewState} from 'store/signature/actions';

const props = (appState: AppState): ConnectedProps => {
	const {signature} = appState;
	const {params} = signature;
	const {drawingStartButtonName} = params;

	return {
		drawingStartButtonName
	}
};

const functions: ConnectedFunctions = {
	setNewState
};

export {
	functions,
	props
};
