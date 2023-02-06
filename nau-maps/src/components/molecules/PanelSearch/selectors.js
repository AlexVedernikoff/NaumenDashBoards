// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {searchMapObject} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {searchQuery} = geolocation;
	return {
		searchQuery
	};
};

const functions: ConnectedFunctions = {
	searchMapObject
};

export {
	functions,
	props
};
