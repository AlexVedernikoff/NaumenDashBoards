// @flow
import type {Element, Node} from 'react';

export type Label = string | Element<'svg'>;

export type RenderValueProps = {
	active: boolean,
	children: Node,
	className: string,
	onClick: () => void
}

export type Option = {
	label: Label,
	value: string
}

export type Props = {
	isDisabled: boolean,
	name: string,
	onSelect: (name: string, value: string) => any,
	options: Array<Option>,
	renderValue?: (props: RenderValueProps) => Node,
	showCaret: boolean,
	tip: string,
	value: string
}

export type State = {
	active: boolean,
	currentOption: Option
}
