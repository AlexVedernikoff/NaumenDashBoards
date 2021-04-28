// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';
import type {MetaClassData} from 'store/sources/attributesData/metaClasses/types';
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	fetchMetaClassData: (metaClassFqn: string) => ThunkAction
};

export type ConnectedProps = {
	metaClassData: MetaClassData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
