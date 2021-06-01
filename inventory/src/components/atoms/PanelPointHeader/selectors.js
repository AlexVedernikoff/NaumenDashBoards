// @flow
import type {ConnectedFunctions} from './types';
import {fetchGeolocation} from 'store/geolocation/actions';

const functions: ConnectedFunctions = {
	fetchGeolocation
};

export {
	functions
};
