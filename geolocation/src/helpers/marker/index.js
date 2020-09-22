// @flow
import type {FetchResponse} from 'types/point';
import {getTimeInSeconds} from 'helpers/time';
import {notify} from 'helpers/notify';
import type {Params} from 'types/params';
import type {Point, StaticGroup} from 'types/point';

/**
 * Returns the color of dynamic point
 * @constructor
 * @param {string} date - The last date of dynamic point in format - dd.mmm.yyyyy hh:mm.
 * @param {Params} params - The context of app.
 * @returns {string} - Color of dynamic point
*/
export const colorActive = (date: string, params: Params): string => {
	const {timeIntervalInactivity} = params;
	const splitted = date.split(' ');
	const dateRightFormat = splitted[0].split('.').reverse().join('-') + ' ' + splitted[1];
	const timestamp = new Date(dateRightFormat).getTime();
	const isActivePoint = new Date().getTime() - timestamp < getTimeInSeconds(timeIntervalInactivity) * 1000;

	return isActivePoint ? params.colorDynamicActivePoint : params.colorDynamicInactivePoint;
};
/**
 * Returns the color of dynamic point
 * @constructor
 * @param {string} group - The group code of static point - .
 * @param {Array<StaticGroup>} staticGroups - The array of static groups for static points.
 * @returns {string} - Color of group for static point
*/
export const colorGroup = (group: string, staticGroups: Array<StaticGroup>): string => {
	const found = staticGroups.find(item => item.code === group);

	return found ? found.color : '';
}

export const checkActivePoint = (point: Point, singlePoint: Point) => {
	const {data} = point;
	const found = data.find(item => item.uuid === singlePoint.data[0].uuid) ? true : false;

	return found;
}

export const getGeoMarkers = (markers: FetchResponse) => {
	const {dynamicPoints, errors, staticGroups, staticPoints } = markers;
	const geoMarkers = {
		dynamicPoints: [],
		staticGroups,
		staticPoints: []
	};

	if(!staticPoints.length && !dynamicPoints.length ) {
		notify('empty', 'empty');
	}
	staticPoints.forEach((marker) => {
		if (marker.geoposition !== null ) {
			geoMarkers.staticPoints.push(marker)
		}
	});
	dynamicPoints.forEach((marker) => {
		if (marker.geoposition !== null ) {
			geoMarkers.dynamicPoints.push(marker);
		}
	});

	if (errors.length) {
		const label = errors.join(', ') + '.';
		notify('static', 'info', label);
	}

	return geoMarkers;
};
