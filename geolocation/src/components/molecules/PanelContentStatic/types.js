// @flow
import type {Params} from 'types/params';
import type {StaticGroup, StaticPoint} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	params: Params,
	staticGroups: Array<StaticGroup>,
	staticPoints: Array<StaticPoint>
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
