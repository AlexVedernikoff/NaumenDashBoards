// @flow
import {NAME_POINT_TYPE} from 'types/equipment';
import {NAME_SECTION_TYPE} from 'types/part';
import {NAME_TRAIL_TYPE} from 'types/trail';
import type {Point, PointData, StaticGroup} from 'types/point';

const filterPointData = (pointData: Array<PointData>, staticGroups: Array<StaticGroup>): Array<PointData> => {
	const activeGroups = [];

	staticGroups.forEach(group => {
		if (group.checked) {
			activeGroups.push(group.code);
		}
	});

	return pointData.filter(item => activeGroups.includes(item.group));
};

/**
 * Возвращает массив отфильтрованных статических точек.
 * @param {Array<Point>} staticPoints - массив статических точек.
 * @param {Array<StaticGroup>} staticGroups - массив статических групп.
 * @param {string} groupingMethodName - метод группировки для статических точек.
 * @returns {Array<Point>} - массив статических точек.
 */
export const filterByGroup = (staticPoints: Array<Point>, staticGroups: Array<StaticGroup>, groupingMethodName: string) => {
	const points = [];

	if (!groupingMethodName || groupingMethodName === '' || staticGroups.length === 0) {
		return staticPoints;
	}

	staticPoints.forEach(staticPoint => {
		const {data, geoposition} = staticPoint;

		if (geoposition) {
			const pointData = filterPointData(data, staticGroups);
			pointData.length && points.push({...staticPoint, data: pointData});
		}
	});

	return points;
};

/**
 * Возвращает массив статических точек отфильтрованных и отсортированных по группам.
 * @param {Array<Point>} staticPoints - массив статических точек.
 * @param {Array<StaticGroup>} staticGroups - массив статических групп.
 * @param {string} groupingMethodName - метод группировки для статических точек.
 * @returns {Array<Point>} - массив статических точек.
 */
export const filterByGroupInPanel = (staticPoints: Array<Point>, staticGroups: Array<StaticGroup>, groupingMethodName: string) => {
	const points = [];

	if (!groupingMethodName || groupingMethodName === '' || staticGroups.length === 0) {
		return staticPoints;
	}

	staticGroups.forEach(group => {
		staticPoints.forEach(staticPoint => {
			if (group.checked) {
				const {data, geoposition, type} = staticPoint;

				data.forEach(dataPoint => {
					if (group.code === dataPoint.group) {
						points.push({data: [dataPoint], geoposition, type});
					}
				});
			}
		});
	});

	return points;
};

/**
 * Возвращает кластерные точки с отсортированными и отфильтрованными данными, если задан метод группировки.
 * @param {Point} singleObject - статическая точка для показа в панели.
 * @param {Array<StaticGroup>} staticGroups - массив статических групп.
 * @param {string} groupingMethodName - метод группировки для статических точек.
 * @returns {Array<Point>} - массив из кластерной точки с отсортироваными и отфильтрованными данными.
 */
export const filterInSingleObject = (singleObject: Point, staticGroups: Array<StaticGroup>, groupingMethodName: string) => {
	const {data} = singleObject;

	if (data.length > 1) {
		return filterByGroupInPanel([singleObject], staticGroups, groupingMethodName);
	}

	return [singleObject];
};

export const checkActivePoint = (point: Point, singleObject: Point, showSingleObject: boolean, searchObjects: Point[]) => {
	if (point && showSingleObject && singleObject) {
		const {data} = point;
		return data.uuid === singleObject.data.uuid;
	}

	if (point && searchObjects && searchObjects.length) {
		const trails = searchObjects.filter(point => point.type === NAME_TRAIL_TYPE);
		const trailsObject = trails.reduce((accum, trail) => {
			const {parts = [], equipments = []} = trail;
			return [
				...accum,
				...parts,
				...equipments
			];
		}, []);

		const objects = [
			...trailsObject,
			...searchObjects.filter(point => point.type === NAME_POINT_TYPE),
			...searchObjects.filter(point => point.type === NAME_SECTION_TYPE)
		];

		return objects.some(object => object.data.uuid === point.data.uuid);
	}

	return false;
};
