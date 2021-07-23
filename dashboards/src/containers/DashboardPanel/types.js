// @flow
export type ConnectedProps = {
	selectedWidget: string,
	swiped: boolean,
};

export type ConnectedFunctions = {
	updateSwiped: (swiped: boolean) => void,
};

export type Props = ConnectedProps & ConnectedFunctions;
