// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setSearchObjects, setSearchText} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {mapObjects, searchText} = geolocation;
	return {
		mapObjects,
		searchText
	};
};

const functions: ConnectedFunctions = {
	setSearchObjects,
	setSearchText
};

export {
	functions,
	props
};
