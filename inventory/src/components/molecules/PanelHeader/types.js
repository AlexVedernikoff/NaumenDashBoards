// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {PointType} from 'types/point';

type OwnProps = {
	header: string
};

export type ConnectedProps = {
	panelShow: PointType,
	listName: string
};

export type ConnectedFunctions = {
	setTab: (panelShow: PointType) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;
