// @flow
export type ConnectedProps = {
	data: Object
};

export type OwnProps = {
	saveNewPartSignature: Function,
	stageRef: Object
};

export type Props = OwnProps & ConnectedProps;
