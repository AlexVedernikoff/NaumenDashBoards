// @flow
export type Option = {
	icon: string,
	value: string
}

export type Props = {
	name: string,
	onSelect: (name: string, value: string) => void,
	options: Array<Option>,
	value: string | null
}

export type State = {
	active: boolean,
	currentOption: Option
}
