// @flow
import type {AttributesMap} from 'store/sources/attributes/types';
import type {FetchRefAttributesAction} from 'store/sources/refAttributes/types';

export type ConnectedProps = {
	refAttributes: AttributesMap,
};

export type ConnectedFunctions = {
	fetchRefAttributes: FetchRefAttributesAction
};

export type Props = ConnectedProps & ConnectedFunctions;
