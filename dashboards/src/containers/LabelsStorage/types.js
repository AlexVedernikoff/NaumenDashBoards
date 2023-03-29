// @flow

type ViewBox = {height: number, width: number, x: number, y: number};

export type Label = {
	className: string,
	content?: React$Node | Function,
	dataKey: string,
	fill: string,
	fontFamily: string,
	fontSize: number,
	force: boolean,
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
	intermediate: boolean,
};

export type StoreLabelProps = Label & {
	force: boolean,
	intermediate: boolean,
};

export type Context = {
	clearLabels: () => void,
	getLabels: () => Array<Label>,
	registerLabel: (key: string, label: Label) => void,
	unregisterLabel: (key: string) => void
};

export type InjectedProps = {
	clearLabels: () => void,
};
