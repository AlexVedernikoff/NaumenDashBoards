// @flow
import type {DataLabelsOptions} from 'utils/recharts/types';
type TooltipPayload = {
	dataKey: string,
	name: string,
	payload: {
		color: string,
		cx: string,
		cy: string,
		fill: string,
		name: string,
		payload: {
			color: string,
			name: string,
			value: number
		},
		stroke: string,
		value: number
	},
	value: number
};

export type Position = {
	x: number,
	y: number
};

type PropsPayload = {
	color: string,
	cx: string,
	cy: string,
	fill: string,
	name: string,
	payload: {
		color: string,
		name: string,
		value: number
	},
	stroke: string,
	value: number
};

export type Props = {
	color: string,
	cx: number,
	cy: number,
	endAngle: number,
	fill: string,
	formatter: (value: number, percent?: number) => string,
	index: number,
	innerRadius: number,
	maxRadius: number,
	midAngle: number,
	middleRadius: number,
	name: string,
	outerRadius: number,
	paddingAngle: number,
	payload: PropsPayload,
	percent: number,
	startAngle: number,
	stroke: string,
	style: DataLabelsOptions,
	textAnchor: string,
	tooltipPayload: Array<TooltipPayload>,
	tooltipPosition: Position,
	value: number,
	x: number,
	y: number,
};
