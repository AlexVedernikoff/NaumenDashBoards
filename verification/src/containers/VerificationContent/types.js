// @flow
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';

type ReceivedProps = {
	children: Node
};

export type ConnectedProps = {
};

export type ConnectedFunctions = {
	setIndexVerification: () => ThunkAction,
	setVerificationAttribute: () => ThunkAction
};

export type Props = ReceivedProps & ConnectedProps & ConnectedFunctions;
