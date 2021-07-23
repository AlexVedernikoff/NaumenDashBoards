// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchMetaClassStates} from 'store/sources/attributesData/states/actions';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {states} = state.sources.attributesData;

	return {
		stateData: states[props.attribute.metaClassFqn]
	};
};

export const functions: ConnectedFunctions = {
	fetchMetaClassStates
};
