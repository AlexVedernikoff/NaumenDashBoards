// @flow
import type {ThunkAction} from 'types';

export type Props = {
	counter: number,
	increment: () => ThunkAction
};

export type ConnectedProps = {
	counter: number
};

export type ConnectedFunctions = {
	increment: () => ThunkAction
};
