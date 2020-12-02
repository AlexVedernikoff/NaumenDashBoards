// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {fetchCatalogItemData} from 'store/sources/attributesData/catalogItems/actions';
import {fetchCurrentObjectAttributes} from 'store/sources/currentObject/actions';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	catalogItems: state.sources.attributesData.catalogItems,
	currentObject: state.sources.currentObject[props.attribute.type]
});

export const functions: ConnectedFunctions = {
	fetchCatalogItemData,
	fetchCurrentObjectAttributes
};
