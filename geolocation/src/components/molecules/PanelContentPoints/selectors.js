// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, panelShow, showSinglePoint, singlePoint, staticPoints} = geolocation;
	const points = panelShow === 'dynamic' ? dynamicPoints : staticPoints;

	return {
		points: (showSinglePoint && singlePoint) ? [singlePoint] : points
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
