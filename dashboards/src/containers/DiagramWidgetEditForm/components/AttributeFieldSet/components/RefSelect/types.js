// @flow
import type {AttributesMap} from 'store/sources/attributes/types';
import type {FetchRefAttributes} from 'store/sources/refAttributes/types';

export type ConnectedProps = {|
	refAttributes: AttributesMap,
|};

export type ConnectedFunctions = {|
	fetchRefAttributes: FetchRefAttributes
|};
