// @flow
import type {ThunkAction} from 'store/types';

type OwnProps = {
};

export type ConnectedProps = {
	dynamicMarkersUuids: string
};

export type ConnectedFunctions = {
	reloadGeolocation: (dynamicMarkersUuids: string) => ThunkAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {
	hover: true | false
};
