// @flow
export type ConnectedProps = {
	data: Object
};

export type OwnProps = {
	saveNewPartSignature: Function,
	layerRef: {
		current: React$Node
	}
};

export type Props = OwnProps & ConnectedProps;
