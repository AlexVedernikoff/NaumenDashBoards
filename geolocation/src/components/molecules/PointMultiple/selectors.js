// @flow
import type {AppState} from 'store/types';
import {checkActivePoint} from 'helpers/marker';
import {colorMultipleGroup} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSinglePoint} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps =>  {
	const {geolocation} = state;
	const {point} = props;
	const {params, showSinglePoint, singlePoint, staticGroups} = geolocation;
	const {colorStaticPoint} = params;
	const {data} = point;
	const active = (showSinglePoint && singlePoint) ? checkActivePoint(point, singlePoint) : false;
	const color = colorMultipleGroup(data, staticGroups, colorStaticPoint);

	return {
		active,
		color,
		count: props.point.data.length
	}
};

const functions: ConnectedFunctions = {
	setSinglePoint
};

export {
	props,
	functions
};
