// @flow
import type {IconName} from 'types/helper';
import type {Point} from 'types/point';

type OwnProps = {
	marker: Point
};

export type ConnectedFunctions = {
};	

export type ConnectedProps = {
	color: string // '#EB5757'
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	open: boolean,
	type: IconName
};
