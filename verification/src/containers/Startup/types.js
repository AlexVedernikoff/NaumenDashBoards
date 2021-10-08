// @flow
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';

type ReceivedProps = {
	children: Node
};

export type ConnectedProps = {
	error: boolean,
	loading: boolean,
	personal: boolean
};

export type ConnectedFunctions = {
	getAttributeData: () => ThunkAction
};

export type Props = ReceivedProps & ConnectedProps & ConnectedFunctions;
