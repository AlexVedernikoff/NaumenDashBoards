// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {filterByGroupInPanel} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, panelShow, showSinglePoint, singlePoint, staticGroups, staticPoints} = geolocation;
	const points = panelShow === 'dynamic' ? dynamicPoints : filterByGroupInPanel(staticPoints, staticGroups);

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
