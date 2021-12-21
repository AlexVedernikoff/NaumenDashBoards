// @flow
import type {ComponentProps as TextProps} from './components/Text/types';
import type {DivRef} from 'components/types';
import type {Options} from 'utils/chart/types';
import type {Props as NeedleProps} from './components/Needle/types';
import type {Props as RangeProps} from './components/Range/types';

export type Components = {
	Needle: React$ComponentType<NeedleProps>,
	Range: React$ComponentType<RangeProps>,
	Text: React$ComponentType<TextProps>,
};

export type Props = {
	color: string,
	components?: Components,
	forwardedRef: DivRef,
	options: Options
};

export type State = {
	arcX: number,
	arcY: number,
	fontSizeScale: number,
	graphHeight: number,
	graphWidth: number,
	height: number,
	indicatorTooltipX: number,
	legendHeight: number,
	legendPosition: string,
	legendWidth: number,
	radius: number,
	width: number
};
