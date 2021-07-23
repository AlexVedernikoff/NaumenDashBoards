// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchObjectData, searchObjects} from 'store/sources/attributesData/objects/actions';

export const props = (state: AppState): ConnectedProps => ({
	objects: state.sources.attributesData.objects
});

export const functions: ConnectedFunctions = {
	fetchObjectData,
	searchObjects
};
