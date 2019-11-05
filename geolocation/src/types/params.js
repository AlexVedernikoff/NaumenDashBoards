// @flow
import type {TimeInterval, UpdatePointsMode} from 'types/helper';

export type Params = {
    autoUpdateLocation: boolean,
    colorStaticPoint: string,
    colorDynamicActivePoint: string,
    colorDynamicInactivePoint: string,
    getPointsMethodName: 'employeesByServiceCallCustom',
    locationUpdateFrequency: {length: number, interval: TimeInterval},
    requestCurrentLocation: boolean,
    timeIntervalInactivity: {length: number, interval: TimeInterval},
    updatePointsMode: UpdatePointsMode
};
