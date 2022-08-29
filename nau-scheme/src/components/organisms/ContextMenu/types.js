// @flow
import type {Connector} from 'components/organisms/Content/types';

export type ContextMenuPosition = {
	scale: number,
	setExportTo: (format: string) => {},
	setScale: (scale: number) => {},
};

export type OwnProps = {
	contextMenu: ContextMenuPosition | null
};

export type ConnectedProps = {
	activeElement: Connector | null,
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
