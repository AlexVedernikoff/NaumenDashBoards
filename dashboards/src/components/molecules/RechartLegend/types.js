// @flow
import {LEGEND_LAYOUT} from 'utils/recharts/constants';
import type {TextHandler} from 'store/widgets/data/types';
import type {ValueFormatter} from 'utils/recharts/formater/types';

type Align = 'left' | 'center' | 'right';
type Layout = $Values<typeof LEGEND_LAYOUT>;
type VerticalAlign = 'top' | 'middle' | 'bottom';
type GraphType = string;

export type Payload = {
	color: string,
	dataKey: string,
	inactive: boolean,
	payload: Object,
	type: GraphType,
	value: string,
};

export type Props = {
	align: Align,
	chartHeight: number,
	chartWidth: number,
	formatter: ValueFormatter,
	height: number,
	iconSize: number,
	inactiveColor: string,
	layout: Layout,
	margin: {
		bottom: number,
		left: number,
		right: number,
		top: number,
	},
	payload: Array<Payload>,
	textHandler: TextHandler,
	verticalAlign: VerticalAlign,
	width: number,
	wrapperStyle: CSSStyleDeclaration
};
