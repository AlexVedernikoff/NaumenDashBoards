// @flow
export type Option = Object;

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => string,
	isEditingLabel: boolean,
	isSearching: boolean,
	name: string,
	onChangeLabel?: (name: string, label: string) => void,
	onClickCreationButton?: () => void,
	onSelect: (name: string, value: Option) => void,
	options: Array<Option>,
	placeholder: string,
	showCreationButton: boolean,
	textCreationButton: string,
	value: Option | null
};

export type State = {
	showMenu: boolean
};
