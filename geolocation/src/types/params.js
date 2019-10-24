// @flow
import type {TimeInterval} from 'types/helper';

export type Params = {
    colorStaticPoint: string,
    colorDynamicActivePoint: string,
    colorDynamicInactivePoint: string,
    timeIntervalInactivity: {length: number, interval: TimeInterval}
};
