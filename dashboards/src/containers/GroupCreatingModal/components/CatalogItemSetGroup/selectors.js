// @flow
import type {AppState} from 'store/types';
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchCatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/actions';

export const props = (state: AppState, props: AttributeGroupProps): ConnectedProps => {
	const {catalogItemSets} = state.sources.attributesData;
	const {property} = props.attribute;

	return {
		selectData: catalogItemSets[property]
	};
};

export const functions: ConnectedFunctions = {
	fetchCatalogItemSetData
};
