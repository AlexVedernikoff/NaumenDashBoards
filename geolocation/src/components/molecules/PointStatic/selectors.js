// @flow
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import type {AppState} from 'store/types';
import {setSinglePoint} from 'store/geolocation/actions';
import {colorGroup} from 'helpers/marker';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {point} = props;
	const {params, showSinglePoint, singlePoint, staticGroups} = geolocation;
	const active = (showSinglePoint && singlePoint) ? checkActivePoint(point, singlePoint) : false;
	const {group} = point.data[0];
	const color = colorGroup(group, staticGroups);

	return {
		active,
		color: color || params.colorStaticPoint
	}
};

const functions: ConnectedFunctions = {
	setSinglePoint
};

export {
	props,
	functions
};
