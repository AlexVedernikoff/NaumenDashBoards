// @flow
import type {AttributesMap, FetchAttributes} from 'store/sources/attributes/types';

export type ConnectedProps = {|
	attributes: AttributesMap
|};

export type ConnectedFunctions = {|
	fetchAttributes: FetchAttributes
|};
