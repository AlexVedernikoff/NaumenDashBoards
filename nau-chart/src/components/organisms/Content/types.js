// @flow
import type {Entity} from 'store/entity/types';

export type ConnectedProps = {
	centerPointUuid: string,
	data: Array<Entity[]>,
	exportTo: string,
	openContextMenu: (e: Event) => {},
	position: {x: number, y: number},
	scale: number,
};

export type ConnectedFunctions = {
	goToPoint: (uuid: string) => {},
	setActiveElement: (payload: Entity) => {},
	setExportTo: (payload: string | null) => {},
	setPosition: (payload: {x: number, y: number}) => {},
	setScale: (delta: ?boolean) => number,
};

export type Props = ConnectedProps & ConnectedFunctions;

export type Connector = Entity & {
	angle?: number,
	fromX?: number,
	fromY?: number,
	toX?: number,
	toY?: number,
	x: number,
	y: number,
};

export type OptionsSizeCanvas = {
	maxX: number,
	maxY: number,
	minY: number,
};

export type Scheme = {lines: Connector[], options: OptionsSizeCanvas, points: Connector[]};
