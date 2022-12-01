// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setSingleObject, setTab} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	return {
		name: state.geolocation.params.listName,
		searchText: state.geolocation.searchText,
		showSingleObject: state.geolocation.showSingleObject
	};
};

const functions: ConnectedFunctions = {
	setSingleObject,
	setTab
};

export {
	functions,
	props
};
