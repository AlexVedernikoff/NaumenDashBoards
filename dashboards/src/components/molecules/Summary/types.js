// @flow
import type {DivRef} from 'components/types';
import type {FontStyle} from 'store/widgets/data/types';
import type {Options} from 'utils/chart/types';
import type {Position} from 'components/molecules/WidgetTooltip/components/Message/types';

export type Props = {
	color: string,
	fontFamily: string,
	fontSize: string | number, // '10px' | '10' | 10
	fontStyle: ?FontStyle,
	forwardedRef: DivRef,
	onClickValue: () => void,
	options: Options,
};

export type State = {
	fontSize: number | null,
	height: number,
	tooltipPosition: ?Position
};
