// @flow
import type {RechartData} from 'utils/recharts/types';

export type AxisTooltip = {
	fill: string,
	indicator: string,
	parameter: string,
	value: string
};

type PropsPayload = {
    color: string,
    dataKey: string,
    fill: string,
    name: string,
    payload: RechartData,
    value: number
};

export type Props = AxisTooltip & {
	active: boolean,
	coordinate: {
		x: number,
		y: number
	},
	payload: Array<PropsPayload>,
	show: boolean,
};
