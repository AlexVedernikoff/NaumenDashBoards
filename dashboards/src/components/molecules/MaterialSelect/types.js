// @flow
export type Option = Object;

type Name = any;

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isEditingLabel: boolean,
	isSearching: boolean,
	name: Name,
	onChangeLabel?: (name: Name, label: string) => void,
	onClickCreationButton?: () => void,
	onSelect: (name: Name, value: Option) => void,
	options: Array<Option>,
	placeholder: string,
	showCreationButton: boolean,
	textCreationButton: string,
	value: Option | null
};

export type State = {
	showMenu: boolean
};
