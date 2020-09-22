// @flow
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import type {AppState} from 'store/types';
import {setSinglePoint} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {point} = props;
	const {showSinglePoint, singlePoint} = geolocation;
	const active = (showSinglePoint && singlePoint) ? checkActivePoint(point, singlePoint) : false;

	return {
		active,
		color: state.geolocation.params.colorStaticPoint
	}
};

const functions: ConnectedFunctions = {
	setSinglePoint
};

export {
	props,
	functions
};
