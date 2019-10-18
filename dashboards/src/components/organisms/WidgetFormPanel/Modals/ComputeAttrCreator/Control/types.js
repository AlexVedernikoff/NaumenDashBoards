// @flow
import type {OptionType} from 'react-select/src/types';

export type Control = {
	name: string,
	next: string | null,
	prev: string | null,
	type: ?string,
	value: null,
}

export type Props = {
	attr: boolean,
	data: Control,
	handleSelect: any,
	onCreateConstant: (name: string, constant: number) => void,
	options: Array<OptionType>
}

export type Values = {
	constant: number
}

export type State = {
	showForm: boolean
}
