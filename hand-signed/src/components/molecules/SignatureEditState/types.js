// @flow
import {SignatureAction} from 'store/signature/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	data: Array<Array<number>>
};

export type ConnectedFunctions = {
	addSignature: (Array<Array<number>>) => SignatureAction,
	sendSignature: (dataUrl: string) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;

export type SizesAndCoords = {
	height: number,
	minY: number,
	minX: number,
	width: number
};
