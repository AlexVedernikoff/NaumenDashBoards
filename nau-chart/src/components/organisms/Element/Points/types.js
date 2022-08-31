// @flow
import type {Entity} from 'store/entity/types';
export type ConnectedProps = {
	entity: Entity,
	x: string,
	y: string
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;
