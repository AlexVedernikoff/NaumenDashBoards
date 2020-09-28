// @flow
import {getTimeInSeconds} from 'helpers/time';
import type {Params} from 'types/params';
import type {GroupCode, Point, PointData, StaticGroup} from 'types/point';

/**
 * Возвращает цвет динамической точки.
 * @constructor
 * @param {string} date - Последняя дата для динаимческой точки - dd.mmm.yyyyy hh:mm.
 * @param {Params} params - Параметры прилоения.
 * @returns {string} - Цвет динамической точки.
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
 * Возвращает цвет статической точки.
 * @constructor
 * @param {GroupCode} group - Код группы из статической точки.
 * @param {Array<StaticGroup>} staticGroups - Массив статических групп.
 * @returns {string} - Цвет из группы для статической точки.
*/
export const colorGroup = (group: GroupCode, staticGroups: Array<StaticGroup>): string => {
	const found = staticGroups.find(item => item.code === group);

	return found ? found.color : '';
};

/**
 * Возвращает цвет для класторной точки.
 * @constructor
 * @param {PointData} data - Массив точек из класторной точки.
 * @param {Array<StaticGroup>} staticGroups - Массив статических групп.
 * @param {string} colorStaticPoint - Цвет по-умолчанию для динамческой точки.
 * @returns {string} - Цвет для класторной точки. Если класторной точки соответсвует несколько групп, то возвращаем пустую строку и показфваем разноцветный маркер.
*/
export const colorMultipleGroup = (data: Array<PointData>, staticGroups: Array<StaticGroup>, colorStaticPoint: string) => {
	const colors = data.map(item => colorGroup(item.group, staticGroups));
	const uniqueColors = [...new Set(colors)];

	if (uniqueColors.length === 1) {
		if (uniqueColors.includes('')) {
			return colorStaticPoint;
		} else {
			return uniqueColors[0];
		}
	}
	return '';
};

/**
 * Возвращает массив отфильтрованных статических точек.
 * @constructor
 * @param {Array<Point>} staticPoints - Массив стаических точек.
 * @param {Array<StaticGroup>} staticGroups - Массив статических групп.
 * @returns {Array<Point>} - Массив статических точек.
*/
export const filterByGroup = (staticPoints: Array<Point>, staticGroups: Array<StaticGroup>) => {
	const points = [];

	staticGroups.forEach(group => {
		staticPoints.forEach(staticPoint => {
			if (group.checked) {
				const {data, geoposition} = staticPoint;

				if (geoposition) {
					const found = data.find(dataPoint => group.code === dataPoint.group);

					found && points.push(staticPoint);
				}
			}
		});
	});
	return points;
};

/**
 * Возвращает массив статических точек отфильтрованных и отсортированных по группам.
 * @constructor
 * @param {Array<Point>} staticPoints - Массив стаических точек.
 * @param {Array<StaticGroup>} staticGroups - Массив статических групп.
 * @returns {Array<Point>} - Массив статических точек.
*/
export const filterByGroupInPanel = (staticPoints: Array<Point>, staticGroups: Array<StaticGroup>) => {
	const points = [];

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

export const checkActivePoint = (point: Point, singlePoint: Point) => {
	const {data} = point;
	const found = !!data.find(item => item.uuid === singlePoint.data[0].uuid);

	return found;
};
