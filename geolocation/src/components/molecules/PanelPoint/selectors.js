// @flow
import type {AppState} from 'store/types';
import {colorActive, colorGroup} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSinglePoint} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {params, showSinglePoint, staticGroups} = geolocation;
	const {geoposition, pointData, type} = props;
	let statusColor = '';

	if (type === 'dynamic' && geoposition) {
		const {date} = geoposition;

		statusColor = colorActive(date, params);
	} else {
		const {group} = pointData;
		const {colorStaticPoint} = params;
		const color = colorGroup(group, staticGroups);

		statusColor = color || colorStaticPoint;
	}

	return {
		statusColor,
		showSinglePoint
	};
};

const functions: ConnectedFunctions = {
	setSinglePoint
};

export {
	functions,
	props
};
