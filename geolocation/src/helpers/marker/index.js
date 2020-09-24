// @flow
import {getTimeInSeconds} from 'helpers/time';
import type {Params} from 'types/params';
import type {Group, Point, PointData, StaticGroup} from 'types/point';

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
 * Returns the color of static point
 * @constructor
 * @param {string} group - The group code of static point.
 * @param {Array<StaticGroup>} staticGroups - The array of static groups for static points.
 * @returns {string} - Color of group for static point
*/
export const colorGroup = (group: Group, staticGroups: Array<StaticGroup>): string => {
	const found = staticGroups.find(item => item.code === group);

	return found ? found.color : '';
}

/**
 * Returns the color of claster point
 * @constructor
 * @param {PointData} data - The data of claster point.
 * @param {Array<StaticGroup>} staticGroups - The array of static groups for static points.
 * @param {string} colorStaticPoint - The dafault color of static point
 * @returns {string} - Color for claster point. If points have few colors return empty string.
*/
export const colorMultipleGroup = (data: Array<PointData>, staticGroups: Array<StaticGroup>, colorStaticPoint: string) => {
	const colors = data.map(item => colorGroup(item.group, staticGroups));
	const uniqueColors = [...new Set(colors)];

	if(uniqueColors.length === 1) {
		if(uniqueColors.includes('')) {
			return colorStaticPoint;
		} else {
			return uniqueColors[0];
		}
	}
	return '';
}

export const checkActivePoint = (point: Point, singlePoint: Point) => {
	const {data} = point;
	const found = data.find(item => item.uuid === singlePoint.data[0].uuid) ? true : false;

	return found;
}

