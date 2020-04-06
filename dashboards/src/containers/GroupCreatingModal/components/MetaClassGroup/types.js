// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import type {MetaClassesMap} from 'store/sources/attributesData/metaClasses/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	metaClasses: MetaClassesMap,
|};

export type ConnectedFunctions = {|
	fetchMetaClassData: (metaClassFqn: string) => ThunkAction
|};

export type Props = {|
	...AttributeGroupProps,
	...ConnectedProps,
	...ConnectedFunctions
|};

export type State = {
	updateDate: Date
};
