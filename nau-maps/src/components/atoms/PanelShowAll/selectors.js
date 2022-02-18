// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setTab} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {singleObject} = geolocation;

	return {
		type: singleObject ? singleObject.type : 'static'
	};
};

const functions: ConnectedFunctions = {
	setTab
};

export {
	functions,
	props
};
