// @flow
import type {IconName} from 'types/helper';
import type {StaticPoint} from 'types/point';

export type OwnProps = {
	marker: StaticPoint
};

export type ConnectedFunctions = {
};

export type ConnectedProps = {
	color: string, // #ffffff
	count: number
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	open: boolean,
	type: IconName
};
