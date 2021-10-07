// @flow
export type TextProps = {
	children: React$Node,
	textAnchor: string,
	x: number,
	y: number
};

export type Components = {
	Text: React$ComponentType<TextProps>,
};

export type Props = {
	color: string,
	components: Components,
	curveText: ?string,
	endDegree: number,
	radius: number,
	startDegree: number,
	strokeWidth: number,
	x: number,
	y: number
};
