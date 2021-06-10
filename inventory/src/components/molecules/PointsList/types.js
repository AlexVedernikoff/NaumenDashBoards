// @flow
import {Common} from 'types/common';
import type {Point} from 'types/point';

type OwnProps = {
	point: Point
};

export type ConnectedProps = {
	mapObjects: Array<Common>
};

export type Props = OwnProps & ConnectedProps;
