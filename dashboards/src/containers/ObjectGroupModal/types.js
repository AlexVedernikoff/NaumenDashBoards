// @flow
import type {Attribute} from 'src/store/sources/attributes/types';
import type {FetchParams, ObjectsState, SearchObjects} from 'store/sources/attributesData/objects/types';
import type {Group, Source} from 'src/store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	objects: ObjectsState
};

export type ConnectedFunctions = {
	fetchObjectData: (params: FetchParams) => ThunkAction,
	searchObjects: SearchObjects
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	fullAttribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	source: Source,
	value: Group
};

export type State = {
	id: string
};
