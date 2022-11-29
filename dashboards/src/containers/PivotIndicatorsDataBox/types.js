// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
};

export type ConnectedFunctions = {
	fetchAttributeByCode: (classFqn: string, attribute: Attribute) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
