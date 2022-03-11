// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {IconName} from 'types/helper';
import type {Trail} from 'types/trail';

export type OwnProps = {
	trail: Trail
};

export type ConnectedFunctions = {
	setSingleObject: (trail: Trail) => GeolocationAction
};

export type ConnectedProps = {
	active: boolean
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	open: boolean,
	timeoutId: TimeoutID | null,
	type: IconName
};
