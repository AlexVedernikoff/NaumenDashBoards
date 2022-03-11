// @flow
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import type {AppState} from 'store/types';
import {setSingleObject} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {point} = props;
	const {showSingleObject, singleObject} = geolocation;
	const active = (showSingleObject && singleObject) ? checkActivePoint(point, singleObject) : false;

	return {
		active
	};
};

const functions: ConnectedFunctions = {
	setSingleObject
};

export {
	functions,
	props
};
