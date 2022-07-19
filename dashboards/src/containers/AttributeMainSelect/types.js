// @flow
import type {AttributesMap, FetchAttributesAction} from 'store/sources/attributes/types';

export type ConnectedProps = {
	attributes: AttributesMap
};

export type ConnectedFunctions = {
	fetchAttributes: FetchAttributesAction
};

export type Props = ConnectedProps & ConnectedFunctions;
