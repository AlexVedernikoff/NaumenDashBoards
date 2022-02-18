// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {showSingleObject} = geolocation;

	return {
		showSingleObject
	};
};

export {
	props
};
