// @flow
import type {AppState} from 'store/types';
import {clearSearchObjects, fetchObjectData, searchObjects} from 'store/sources/attributesData/objects/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => ({
	objects: state.sources.attributesData.objects
});

export const functions: ConnectedFunctions = {
	clearSearchObjects,
	fetchObjectData,
	searchObjects
};
