// @flow
import type {TimeInterval} from 'types/helper';

export type Params = {
	autoUpdateLocation: boolean,
	colorPart: string,
	groupingMethodName: string,
	listName: string,
	locationUpdateFrequency: {length: number, interval: TimeInterval},
	requestCurrentLocation: boolean,
	updatePointsMode: string
};
