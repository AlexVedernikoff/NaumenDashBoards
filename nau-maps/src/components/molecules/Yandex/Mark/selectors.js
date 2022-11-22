// @flow
import type {AppState} from 'store/types';
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSingleObject, toggleMapContextMenu} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {point} = props;
	const {searchObjects, showSingleObject, singleObject} = geolocation;
	const active = checkActivePoint(point, singleObject, showSingleObject, searchObjects);

	return {
		active
	};
};

const functions: ConnectedFunctions = {
	setSingleObject,
	toggleMapContextMenu
};

export {
	functions,
	props
};
