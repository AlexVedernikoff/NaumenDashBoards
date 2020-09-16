// @flow
import type { GeolocationAction} from 'store/geolocation/types';
import type {PanelShow} from 'types/helper';

type OwnProps = {
	header: string
};

export type ConnectedProps = {
	dynamicPointsListName: string,
	panelShow: PanelShow,
	staticPointsListName: string
};

export type ConnectedFunctions = {
	setTab: (panelShow: PanelShow) => GeolocationAction
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {};
