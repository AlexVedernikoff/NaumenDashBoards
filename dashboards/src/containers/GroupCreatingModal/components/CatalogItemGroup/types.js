// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {CatalogItemsMap} from 'store/sources/attributesData/catalogItems/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	catalogItems: CatalogItemsMap,
|};

export type ConnectedFunctions = {|
	fetchCatalogItemData: (property: string) => ThunkAction
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};
