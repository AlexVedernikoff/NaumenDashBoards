// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	selectData: CatalogItemSetData,
|};

export type ConnectedFunctions = {|
	fetchCatalogItemSetData: (property: string) => ThunkAction
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};

export type State = {
	customType: string,
	updateDate: Date
};
