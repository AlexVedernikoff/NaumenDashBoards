// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {FetchParams, ObjectsState} from 'store/sources/attributesData/objects/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	objects: ObjectsState,
|};

export type ConnectedFunctions = {|
	fetchObjectData: (params: FetchParams) => ThunkAction
|};

export type Props = {
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
};

export type State = {
	customType: string,
	updateDate: Date
};
