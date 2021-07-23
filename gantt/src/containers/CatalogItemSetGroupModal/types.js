// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import type {Group} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	fetchCatalogItemSetData: (property: string) => ThunkAction
};

export type ConnectedProps = {
	catalogItemSetData: CatalogItemSetData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
