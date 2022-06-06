// @flow
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';

type ReceivedProps = {
	children: Node
};

export type ConnectedProps = {
	error: boolean,
	loading: boolean
};

export type ConnectedFunctions = {
	getVerify: () => ThunkAction
};

export type Props = ReceivedProps & ConnectedProps & ConnectedFunctions;
