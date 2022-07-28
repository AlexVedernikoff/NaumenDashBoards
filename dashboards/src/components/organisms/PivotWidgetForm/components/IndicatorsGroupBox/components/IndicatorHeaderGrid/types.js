// @flow
import type {GroupIndicatorInfo, IndicatorGrouping, IndicatorInfo} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';

export type FlatIndicatorGrouping = {
	height: number,
	item: GroupIndicatorInfo,
	level: number,
	offset: number,
	parent: ?GroupIndicatorInfo,
	type: typeof INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO,
	width: number
};

export type FlatIndicatorInfo = {
	item: IndicatorInfo,
	level: number,
	offset: number,
	parent: ?GroupIndicatorInfo,
	type: typeof INDICATOR_GROUPING_TYPE.INDICATOR_INFO
};

export type FlatIndicatorArray = Array<FlatIndicatorGrouping | FlatIndicatorInfo>;

export type FindTargetResult = {
	level: number,
	offset: number,
	target: FlatIndicatorGrouping | FlatIndicatorInfo | null
};

export type CalculateColumnsCountResult = {
	count: number,
	list: FlatIndicatorArray
};

export type Props = {
	onChange: (value: IndicatorGrouping) => void,
	value: IndicatorGrouping
};

export type State = {
	count: number,
	height: number,
	itemWidth: number,
	list: FlatIndicatorArray,
	mouseOffset: {x: number, y: number}
};
