// @flow
import type {AttributeGroupProps, FetchCurrentObjectAttributes} from 'containers/GroupCreatingModal/types';
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import type {ThunkAction} from 'store/types';
import type {TypeData} from 'store/sources/currentObject/types';

export type ConnectedProps = {|
	currentObject: TypeData,
	selectData: CatalogItemSetData,
|};

export type ConnectedFunctions = {|
	fetchCatalogItemSetData: (property: string) => ThunkAction,
	fetchCurrentObjectAttributes: FetchCurrentObjectAttributes
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};

export type State = {
	customType: string
};
