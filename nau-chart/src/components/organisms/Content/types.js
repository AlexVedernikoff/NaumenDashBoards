// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;

export interface Connector extends Entity {
	angle: string,
	x: string,
	y: string,
}

export type OptionsSizeCanvas = {
	maxX: string,
	maxY: string,
	minY: string,
};
