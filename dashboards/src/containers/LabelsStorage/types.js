// @flow

type ViewBox = {height: number, width: number, x: number, y: number};

export type Label = {
	className: string,
	content?: React$Node | Function,
	dataKey: string,
	fill: string,
	fontFamily: string,
	fontSize: number,
	formatter?: Function,
	height: number,
	name: string,
	parentViewBox?: ViewBox,
	textBreakAll?: boolean,
	value: number,
	viewBox: ViewBox,
	width: number,
	x: number,
	y: number,
};

export type StoreLabelProps = Label & { };

export type Context = {
	clearLabels: () => void,
	getLabels: () => Array<Label>,
	registerLabel: (key: string, label: Label) => void
};

export type InjectedProps = {
	clearLabels: () => void,
};
