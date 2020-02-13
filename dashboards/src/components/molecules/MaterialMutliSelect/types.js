// @flow
export type Option = {
	label: string,
	value: string
};

export type Props = {
	displayLimit: number,
	isSearching: boolean,
	name: string,
	onClear: () => void,
	onRemove: string => void,
	onSelect: (name: string, value: Option) => void,
	options: Array<Option>,
	values: Array<Option>
};

export type State = {
	showAllTags: boolean,
	showMenu: boolean
};
