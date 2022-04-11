// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setSingleObject} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {showSingleObject} = geolocation;
	const statusColor = showSingleObject && 'blue';

	return {
		showSingleObject,
		statusColor
	};
};

const functions: ConnectedFunctions = {
	setSingleObject
};

export {
	functions,
	props
};
