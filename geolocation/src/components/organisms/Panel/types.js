// @flow
import type {Point} from 'types/point';

export type OwnProps = {};

export type ConnectedProps = {
	open: boolean,
	showSinglePoint: boolean,
	singlePoint: Point | null
};

export type ConnectedFunctions = {};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {};
