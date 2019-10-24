// @flow
import type {IconName} from 'types/helper';
import type {MultiplePoint} from 'types/multiple';

export type OwnProps = {
	marker: MultiplePoint
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
