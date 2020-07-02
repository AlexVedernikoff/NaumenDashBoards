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

export type Props = {
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
