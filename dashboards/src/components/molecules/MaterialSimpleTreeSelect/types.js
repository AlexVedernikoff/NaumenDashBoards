// @flow
export type Option = Object;

type Name = any;

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	name: Name,
	onSelect: (name: Name, value: Option) => void,
	options: Array<Option>,
	placeholder: string,
	value: Option | null
};

export type State = {
	showTree: boolean
};
