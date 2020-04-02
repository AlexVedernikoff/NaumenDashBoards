// @flow
export type Option = Object;

type Event = {
	name: string,
	value: Option
};

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	name: string,
	onSelect: Event => void,
	options: Array<Option>,
	placeholder: string,
	value: Option | null
};

export type State = {
	showTree: boolean
};
