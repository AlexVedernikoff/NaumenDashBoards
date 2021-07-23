// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';
import type {StateData} from 'store/sources/attributesData/states/types';
import type {ThunkAction} from 'src/store/types';

export type ConnectedFunctions = {
	fetchMetaClassStates: (metaClassFqn: string) => ThunkAction
};

export type ConnectedProps = {
	stateData: StateData
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
