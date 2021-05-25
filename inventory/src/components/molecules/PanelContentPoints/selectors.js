// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {filterInSinglePoint, filterByGroupInPanel} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, panelShow, params, showSinglePoint, singlePoint, staticGroups, staticPoints, timeUpdate} = geolocation;
	const {groupingMethodName} = params;
	const pointsAll = panelShow === 'dynamic' ? dynamicPoints : filterByGroupInPanel(staticPoints, staticGroups, groupingMethodName);
	const points = (showSinglePoint && singlePoint) ? filterInSinglePoint(singlePoint, staticGroups, groupingMethodName) : pointsAll;

	return {
		points,
		timeUpdate
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
