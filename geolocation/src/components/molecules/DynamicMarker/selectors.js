// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, OwnProps} from './types';
import {colorActive} from 'helpers/marker';

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
