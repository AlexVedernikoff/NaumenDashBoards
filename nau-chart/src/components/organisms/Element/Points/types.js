// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
	centerPointUuid: string | null,
	entity: Entity,
	scale: number,
	x: number,
	y: number
};

export type ConnectedFunctions = {
	handleContextMenu: (e: Event) => {},
	onClick: (entity: Entity) => {},
	onHover: (hover: boolean) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
