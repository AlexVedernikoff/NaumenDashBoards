// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
	activeElement: Entity,
	entity: Entity,
	points: {
		fromX: number,
		fromY: number,
		toX: number,
		toY: number
	},
	scale: number,
	searchObjects: Entity[]
};

export type ConnectedFunctions = {
	handleActiveElement: (entity: Entity) => {},
	handleContextMenu: (e: Event) => {},
	handleIsHoverCursor: (hover: boolean) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
