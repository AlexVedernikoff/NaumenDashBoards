// @flow
export type Option = Object;

export type Props = {
	displayLimit: number,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClear?: () => void,
	onClick: () => void,
	onRemove?: (value: string) => void,
	values: Array<Option>
};

export type State = {
	showAllTags: boolean
};
