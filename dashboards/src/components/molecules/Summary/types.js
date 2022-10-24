// @flow
import type {DivRef} from 'components/types';
import type {FontStyle} from 'store/widgets/data/types';
import type {SummaryOptions} from 'utils/recharts/types';

export type Options = {
	...SummaryOptions,
	value: number
};

type TooltipPosition = {
	x: number,
	y: number
};

export type Props = {
	color: string,
	fontFamily: string,
	fontSize: string | number, // '10px' | '10' | 10
	fontStyle: ?FontStyle,
	forwardedRef: DivRef,
	onClickDiff: () => void,
	onClickValue: () => void,
	options: Options,
};

export type State = {
	fontSize: number,
	forwardedRef: ?DivRef,
	height: number,
	tooltipPosition: ?TooltipPosition,
	visibility: boolean,
};
