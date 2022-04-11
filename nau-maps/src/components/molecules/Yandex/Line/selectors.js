// @flow
import type {AppState} from 'store/types';
import {checkActivePoint} from 'helpers/marker';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSingleObject, toggleMapContextMenu} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {part} = props;
	const {params, showSingleObject, singleObject} = geolocation;
	const data = {
		data: part.data,
		geoposition: part.geopositions[0],
		type: part.type
	};
	const active = (showSingleObject && singleObject) ? checkActivePoint(data, singleObject) : false;

	return {
		active,
		color: part.data.color || params.colorPart
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
