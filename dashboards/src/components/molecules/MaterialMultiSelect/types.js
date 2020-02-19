// @flow
export type Option = Object;

export type Props = {
	displayLimit: number,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isSearching: boolean,
	name: string,
	onClear: () => void,
	onClickShowMore?: () => void,
	onRemove: string => void,
	onSelect: (name: string, value: Option) => void,
	options: Array<Option>,
	showMore: boolean,
	values: Array<Option>
};

export type State = {
	showAllTags: boolean,
	showMenu: boolean
};
