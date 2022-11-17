// @flow
export type ConnectedProps = {
	scale: number,
	setExportTo: (format: string) => {},
	setScale: (delta: ?boolean) => {},
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;
