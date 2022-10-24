// @flow
export type ConnectedProps = {
	scale: number,
	setExportTo: (format: string) => {},
	setScale: (delta: boolean | undefined) => {},
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;
