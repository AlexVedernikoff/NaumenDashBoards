// @flow
import type {AttributeGroupProps, FetchCurrentObjectAttributes} from 'containers/GroupCreatingModal/types';
import type {CatalogItemsMap} from 'store/sources/attributesData/catalogItems/types';
import type {ThunkAction} from 'store/types';
import type {TypeData} from 'store/sources/currentObject/types';

export type ConnectedProps = {|
	catalogItems: CatalogItemsMap,
	currentObject: TypeData
|};

export type ConnectedFunctions = {|
	fetchCatalogItemData: (property: string) => ThunkAction,
	fetchCurrentObjectAttributes: FetchCurrentObjectAttributes
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};
