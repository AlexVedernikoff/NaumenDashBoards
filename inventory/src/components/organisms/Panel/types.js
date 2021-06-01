// @flow
import type {Point} from 'types/point';

export type OwnProps = {};

export type ConnectedProps = {
	open: boolean,
	showSingleObject: boolean,
	singleObject: Point | null
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
