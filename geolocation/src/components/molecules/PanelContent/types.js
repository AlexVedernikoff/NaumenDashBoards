// @flow
import type {Params} from 'types/params';
import type {DynamicPoint, StaticGroup, StaticPoint} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	params: Params,
	panelShow: string,
	pointsShow: Array<DynamicPoint | StaticPoint>,
	staticGroups: Array<StaticGroup>
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
