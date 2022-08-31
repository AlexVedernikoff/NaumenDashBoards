// @flow
export type ConnectedProps = {
	scale: number,
	setExportTo: (format: string) => {},
	setScale: (scale: number) => {},
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;
