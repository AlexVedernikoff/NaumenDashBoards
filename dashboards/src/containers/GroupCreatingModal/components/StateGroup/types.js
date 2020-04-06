// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {StatesMap} from 'store/sources/attributesData/states/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	states: StatesMap,
|};

export type ConnectedFunctions = {|
	fetchMetaClassStates: (metaClassFqn: string) => ThunkAction
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};

export type State = {
	updateDate: Date
};
