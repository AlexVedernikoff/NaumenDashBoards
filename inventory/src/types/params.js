// @flow
import type {TimeInterval, UpdatePointsMode} from 'types/helper';

export type Params = {
	autoUpdateLocation: boolean,
	dynamicPointsListName: string,
	groupingMethodName: string,
	command: string,
	colorStaticPoint: string,
	colorDynamicActivePoint: string,
	colorDynamicInactivePoint: string,
	pointsMethodName: string,
	locationUpdateFrequency: {length: number, interval: TimeInterval},
	requestCurrentLocation: boolean,
	staticPointsListName: string,
	timeIntervalInactivity: {length: number, interval: TimeInterval},
	updatePointsMode: UpdatePointsMode
};
