// @flow
import type {AttributeGroupProps, FetchCurrentObjectAttributes} from 'containers/GroupCreatingModal/types';
import type {FetchParams, ObjectsState} from 'store/sources/attributesData/objects/types';
import type {ThunkAction} from 'store/types';
import type {TypeData} from 'store/sources/currentObject/types';

export type ConnectedProps = {|
	currentObject: TypeData,
	objects: ObjectsState,
|};

export type ConnectedFunctions = {|
	fetchCurrentObjectAttributes: FetchCurrentObjectAttributes,
	fetchObjectData: (params: FetchParams) => ThunkAction
|};

export type Props = {
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
};

export type State = {
	customType: string
};
