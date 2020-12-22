// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchCurrentObjectAttributes} from 'store/sources/currentObject/actions';
import {fetchObjectData, searchObjects} from 'store/sources/attributesData/objects/actions';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	currentObject: state.sources.currentObject[props.attribute.type],
	objects: state.sources.attributesData.objects
});

export const functions: ConnectedFunctions = {
	fetchCurrentObjectAttributes,
	fetchObjectData,
	searchObjects
};
