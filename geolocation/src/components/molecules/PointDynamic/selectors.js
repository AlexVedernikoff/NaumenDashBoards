// @flow
import type {AppState} from 'store/types';
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {colorActive} from 'helpers/marker';
import {setSinglePoint} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {point} = props;
	const {params, showSinglePoint, singlePoint} = geolocation;
	const {geoposition} = point;
	const {date} = geoposition;
	const color = colorActive(date, params);
	const active = (showSinglePoint && singlePoint) ? checkActivePoint(point, singlePoint) : false;

	return {
		active,
		color,
		geoposition: props.point.geoposition
	};
};

const functions: ConnectedFunctions = {
	setSinglePoint
};

export {
	props,
	functions
};
