// @flow
import type {DivRef} from 'components/types';
import type {Options} from 'utils/chart/types';

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
	color: string,
	components?: Components,
	forwardedRef: DivRef,
	options: Options
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
