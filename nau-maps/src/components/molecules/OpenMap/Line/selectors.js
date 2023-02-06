// @flow
import type {AppState} from 'store/types';
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSingleObject, toggleMapContextMenu} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {part} = props;
	const {params, searchObjects, showSingleObject, singleObject} = geolocation;
	const line = {
		data: part.data,
		geoposition: part.geopositions[0],
		type: part.type
	};
	const active = checkActivePoint(line, singleObject, showSingleObject, searchObjects);

	return {
		active,
		color: part.color || params.colorPart
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
