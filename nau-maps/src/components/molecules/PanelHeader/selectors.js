// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setTab} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	return {
		name: state.geolocation.params.listName,
		showSingleObject: state.geolocation.showSingleObject
	};
};

const functions: ConnectedFunctions = {
	setTab
};

export {
	functions,
	props
};
