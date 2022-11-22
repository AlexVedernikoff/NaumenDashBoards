// @flow
type OwnProps = {
	header: string
};

export type ConnectedProps = {
	listName: string
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
