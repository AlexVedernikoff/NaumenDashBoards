// @flow
export type Option = Object;

export type Value = Object;

export type Props = {
	className: string,
	getOptionLabel: Option => string,
	getOptionValue: Option => string,
	onSelect: Option => void,
	options: Array<Option>,
	value: Value | null
};
