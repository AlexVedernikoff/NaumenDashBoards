// @flow

import type {FontStyle} from 'store/widgets/data/types';

export type DefaultProps = {
	className: string,
	dominantBaseline: string,
	fill: ?string,
	fontSizeScale: number,
	textAnchor: string
};

export type TextStyle = {
	fontColor: string,
	fontFamily: string,
	fontSize: string | number,
	fontStyle: ?FontStyle,
	show: boolean,
};

export type Props = {
	...$Shape<DefaultProps>,
	children: React$Node,
	style: TextStyle,
	x: number,
	y: number
};

export type ComponentProps = React$Config<Props, DefaultProps>;
