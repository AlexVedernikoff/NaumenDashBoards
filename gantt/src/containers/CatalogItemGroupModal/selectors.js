// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchCatalogItemData} from 'store/sources/attributesData/catalogItems/actions';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {catalogItems} = state.sources.attributesData;
	const {property} = props.attribute;

	return {
		catalogItemData: catalogItems[property]
	};
};

export const functions: ConnectedFunctions = {
	fetchCatalogItemData
};
