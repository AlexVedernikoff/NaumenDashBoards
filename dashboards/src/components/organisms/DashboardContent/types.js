// @flow

export type ContextMenu = {
	x: number,
	y: number
};

export type State = {
	contextMenu: ContextMenu | null,
	selectedWidget: string,
	swipedPanel: boolean,
	width: number | null
};
