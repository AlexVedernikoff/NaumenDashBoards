// @flow
import type {AppState} from 'store/types';
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchCatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/actions';
import {fetchCurrentObjectAttributes} from 'store/sources/currentObject/actions';

export const props = (state: AppState, props: AttributeGroupProps): ConnectedProps => {
	const {attributesData, currentObject} = state.sources;
	const {property, type} = props.attribute;

	return {
		currentObject: currentObject[type],
		selectData: attributesData.catalogItemSets[property]
	};
};

export const functions: ConnectedFunctions = {
	fetchCatalogItemSetData,
	fetchCurrentObjectAttributes
};
