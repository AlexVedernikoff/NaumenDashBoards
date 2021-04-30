// @flow
import type {Layout} from 'store/dashboard/layouts/types';

export type ContextMenu = {
	x: number,
	y: number
};

export type State = {
	contextMenu: ContextMenu | null,
	lastWebLGLayouts: ?Layout[],
	selectedWidget: string,
	swipedPanel: boolean,
	width: number | null
};
