// @flow
export type Option = {
	label: string,
	value: string
};

export type Props = {
	defaultValue: Option,
	name: string,
	onSelect: (name: string, value: Option) => void,
	options: Array<Option>,
	value: Option | null
}

export type State = {
	showMenu: boolean
}
