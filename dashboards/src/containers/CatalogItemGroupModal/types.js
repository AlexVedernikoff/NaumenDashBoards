// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CatalogItemData} from 'store/sources/attributesData/catalogItems/types';
import type {Group} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	fetchCatalogItemData: (property: string) => ThunkAction
};

export type ConnectedProps = {
	catalogItemData: CatalogItemData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
