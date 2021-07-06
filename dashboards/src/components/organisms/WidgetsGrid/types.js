// @flow
import type {ConnectedProps, DispatchConnectedFunctions} from 'containers/WidgetsGrid/types';
import type {Layout} from 'store/dashboard/layouts/types';

export type Props = ConnectedProps & DispatchConnectedFunctions;

export type ContextMenu = {
	x: number,
	y: number
};

export type State = {
	contextMenu: ?ContextMenu,
	gridMounted: boolean,
	lastWebLGLayouts: ?Layout[],
	width: ?number
};
