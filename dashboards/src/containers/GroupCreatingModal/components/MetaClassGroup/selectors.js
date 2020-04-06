// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchMetaClassData} from 'store/sources/attributesData/metaClasses/actions';

export const props = (state: AppState): ConnectedProps => {
	const {metaClasses} = state.sources.attributesData;

	return {
		metaClasses
	};
};

export const functions: ConnectedFunctions = {
	fetchMetaClassData
};
