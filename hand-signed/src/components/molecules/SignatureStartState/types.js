// @flow
import {SignatureAction} from 'store/signature/types';

export type ConnectedProps = {
	drawingStartButtonName: string
};

export type ConnectedFunctions = {
	setNewState: () => SignatureAction
};

export type Props = ConnectedProps & ConnectedFunctions;
