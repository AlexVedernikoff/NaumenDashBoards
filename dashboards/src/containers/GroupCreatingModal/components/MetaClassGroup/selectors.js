// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchMetaClassData} from 'store/sources/attributesData/metaClasses/actions';

export const props = (state: AppState): ConnectedProps => ({
	metaClasses: state.sources.attributesData.metaClasses
});

export const functions: ConnectedFunctions = {
	fetchMetaClassData
};
