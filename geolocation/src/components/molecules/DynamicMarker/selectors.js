// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, OwnProps} from './types';
import {getTimeInSeconds} from 'helpers/time';
import type {Params} from 'types/params';

const colorActive = (dateMarker: string, params: Params) => {
	const {timeIntervalInactivity} = params;
	const dataMarker = dateMarker.split(' ');
	const date = dataMarker[0].split('.').reverse().join('.') + ' ' + dataMarker[1];
	const dataMarkerTimestamp = new Date(date).getTime();

	const isActivePoint = new Date().getTime() - dataMarkerTimestamp < getTimeInSeconds(timeIntervalInactivity) * 1000;
	const colorDynamic = isActivePoint ? 'colorDynamicActivePoint' : 'colorDynamicInactivePoint';

	return params[colorDynamic];
};

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {params} = state.geolocation;
	const {date} = props.marker.geoposition;
	const color = colorActive(date, params);

	return {
		color,
		geoposition: props.marker.geoposition
	};
};

export {
	props
};
