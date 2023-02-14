// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
	activeElement: Entity,
	entity: Entity,
	scale: number,
	searchObjects: Entity[],
	x: number,
	y: number
};

export type ConnectedFunctions = {
	handleActiveElement: (entity: Entity, ctrlKey: boolean) => {},
	handleContextMenu: (e: Event) => {},
	handleIsHoverCursor: (hover: boolean) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
