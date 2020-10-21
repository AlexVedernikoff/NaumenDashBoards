// @flow
import type {RangesType} from 'store/widgets/data/types';

type Range = {
	color: string,
	from: string | number,
	to: string | number
};

type Ranges = {
	data: Array<Range>,
	type: RangesType,
	use: boolean
};

export type TextValueProps = {
	alignmentBaseline: string,
	children: React$Node,
	fontSize: number,
	textAnchor: string,
	x: number,
	y: number
};

type Components = {
	TextValue: React$ComponentType<TextValueProps>
};

export type Props = {
	components?: Components,
	max: number,
	min: number,
	ranges: Ranges,
	title: string,
	value: number
};

export type State = {
	arcWidth: number,
	arcX: number,
	arcY: number,
	fontSizeScale: number,
	height: number,
	radius: number,
	width: number
};
