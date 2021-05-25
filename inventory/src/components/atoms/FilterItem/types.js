// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {GroupCode, StaticGroup} from 'types/point';

export type OwnProps = {};

export type ConnectedProps = {
	filterItem: StaticGroup
};

export type ConnectedFunctions = {
	toggleGroup: (code: GroupCode) => GeolocationAction
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;

export type State = {};
