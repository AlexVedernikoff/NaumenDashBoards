// @flow
type OwnProps = {};

export type ConnectedProps = {
	searchQuery: string
};

export type ConnectedFunctions = {
	searchMapObject: (searchQuery: string) => {}
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
