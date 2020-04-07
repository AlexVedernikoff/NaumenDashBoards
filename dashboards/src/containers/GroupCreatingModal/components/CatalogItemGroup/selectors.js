// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchCatalogItemData} from 'store/sources/attributesData/catalogItems/actions';

export const props = (state: AppState): ConnectedProps => ({
	catalogItems: state.sources.attributesData.catalogItems
});

export const functions: ConnectedFunctions = {
	fetchCatalogItemData
};
