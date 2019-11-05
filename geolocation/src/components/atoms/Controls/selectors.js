// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchGeolocation, reloadGeolocation} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {updatePointsMode} = state.geolocation.params;

	return ({
		updatePointsMode
	});
};

const functions: ConnectedFunctions = {
	fetchGeolocation,
	reloadGeolocation
};

export {
	functions,
	props
};
