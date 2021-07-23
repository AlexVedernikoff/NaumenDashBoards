// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchMetaClassData} from 'src/store/sources/attributesData/metaClasses/actions';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {metaClasses} = state.sources.attributesData;

	return {
		metaClassData: metaClasses[props.attribute.metaClassFqn]
	};
};

export const functions: ConnectedFunctions = {
	fetchMetaClassData
};
