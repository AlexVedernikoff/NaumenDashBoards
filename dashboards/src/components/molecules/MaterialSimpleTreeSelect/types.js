// @flow
export type Option = Object;

type Value = Object;

export type Props = {
	async: boolean,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	name: string,
	onLoadOptions: () => void,
	onSelect: (name: string, value: Value) => void,
	options: Array<Option>,
	placeholder: string,
	value: Value | null
};

export type State = {
	optionsLoaded: boolean,
	showTree: boolean
};
