// @flow
import type {Point} from 'types/point';

type OwnProps = {
	marker: Point
};

export type ConnectedProps = {
};

export type ConnectedFunctions = {
	openToggle: () => void
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	actionsShadow: boolean,
	headerShadow: boolean
};
