// @flow
export type RenderValueProps = {
	active: boolean,
	children: React$Node,
	className: string,
	onClick: () => void
};

export type Option = {
	label: string,
	value: string
};

export type Props = {
	className: string,
	isDisabled: boolean,
	name: string,
	onSelect: (name: string, value: string) => any,
	options: Array<Option>,
	renderLabel?: (label: string) => React$Node,
	renderValue?: (props: RenderValueProps) => React$Node,
	showCaret: boolean,
	tip: string,
	value: string
};

export type State = {
	active: boolean,
	currentOption: Option
};
