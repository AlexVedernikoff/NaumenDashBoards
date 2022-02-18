// @flow
import type {GeolocationAction} from 'store/geolocation/types';
import type {IconName} from 'types/helper';
import type {Part} from 'types/part';

export type OwnProps = {
	part: Part
};

export type ConnectedFunctions = {
	setSingleObject: (part: Part) => GeolocationAction
};

export type ConnectedProps = {
	active: boolean,
	color: string
};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	open: boolean,
	timeoutId: TimeoutID | null,
	type: IconName
};
