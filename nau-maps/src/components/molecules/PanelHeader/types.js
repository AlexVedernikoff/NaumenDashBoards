// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {PointType} from 'types/point';

type OwnProps = {
	header: string
};

export type ConnectedProps = {
	listName: string,
	panelShow: PointType
};

export type ConnectedFunctions = {
	setTab: (panelShow: PointType) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
