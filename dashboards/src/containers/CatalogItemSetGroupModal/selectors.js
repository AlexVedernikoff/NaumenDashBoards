// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchCatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/actions';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {catalogItemSets} = state.sources.attributesData;

	return {
		catalogItemSetData: catalogItemSets[props.attribute.property]
	};
};

export const functions: ConnectedFunctions = {
	fetchCatalogItemSetData
};
