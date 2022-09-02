// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {setSingleObject, toggleMapContextMenu} from 'store/geolocation/actions';

const props = (state: AppState, props: OwnProps): ConnectedProps => {
	const {geolocation} = state;
	const {part} = props;
	const {params} = geolocation;

	return {
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
