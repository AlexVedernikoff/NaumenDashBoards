// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setTab} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {singlePoint} = geolocation;

	return {
		type: singlePoint ? singlePoint.type : 'static'
	};
};

const functions: ConnectedFunctions = {
	setTab
};

export {
	functions,
	props
};
