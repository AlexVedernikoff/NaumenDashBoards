// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchGeolocation} from 'store/geolocation/actions';

const props = (): ConnectedProps => {
	return {};
};

const functions: ConnectedFunctions = {
	fetchGeolocation
};

export {
	functions,
	props
};
