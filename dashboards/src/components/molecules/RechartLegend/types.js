// @flow
import type {ComboValueFormatter, ValueFormatter} from 'utils/recharts/formater/types';
import {LEGEND_LAYOUT} from 'utils/recharts/constants';
import type {TextHandler} from 'store/widgets/data/types';

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
	comboFormatter: ComboValueFormatter,
	formatter: ValueFormatter,
	height: number,
	hiddenSeries: Array<string>,
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
	toggleSeriesShow?: (series: string) => void,
	verticalAlign: VerticalAlign,
	width: number,
	wrapperStyle: CSSStyleDeclaration
};
