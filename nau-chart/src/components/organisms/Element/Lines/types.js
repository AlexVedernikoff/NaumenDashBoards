// @flow
import type {Entity} from 'store/entity/types';
export type ConnectedProps = {
	entity: Entity,
	points: {
		fromX: string,
		fromY: string,
		toX: string,
		toY: string
	}
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;