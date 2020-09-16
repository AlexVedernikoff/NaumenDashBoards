// @flow
import type {Geoposition} from 'types/geoposition';
import type {IconName} from 'types/helper';
import type {DynamicPoint} from 'types/point';

export type OwnProps = {
	marker: DynamicPoint
};

export type ConnectedFunctions = {
};

export type ConnectedProps = {
	color: string, // '#4D92C8'
	geoposition: Geoposition
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	open: boolean,
	type: IconName
};
