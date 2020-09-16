// @flow
import type {Params} from 'types/params';
import type {DynamicPoint} from 'types/point';

type OwnProps = {};

export type ConnectedProps = {
	params: Params,
	dynamicPoints: Array<DynamicPoint>
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
