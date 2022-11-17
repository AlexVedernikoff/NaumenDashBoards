// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
	centerPointUuid: string | null,
	entity: Entity,
	points: {
		fromX: number,
		fromY: number,
		toX: number,
		toY: number
	},
	scale: number
};

export type ConnectedFunctions = {
	handleContextMenu: (e: Event) => {},
	onClick: (entity: Entity) => {},
	onHover: (hover: boolean) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
