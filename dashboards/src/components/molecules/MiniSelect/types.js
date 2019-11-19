// @flow
import type {Element} from 'react';

export type Label = string | Element<'svg'>;

export type Option = {
	label: Label,
	value: string
}

export type Props = {
	isDisabled: boolean,
	name: string,
	onSelect: (name: string, value: string) => any,
	options: Array<Option>,
	showCaret: boolean,
	value: string
}

export type State = {
	active: boolean,
	currentOption: Option
}
