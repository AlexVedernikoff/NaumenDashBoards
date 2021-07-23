// @flow
export type Option = Object;

export type Props = {
	displayLimit: number,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClear?: () => void,
	onClick: () => void,
	onRemove?: (index: number) => void,
	placeholder: string,
	values: Array<Option>
};

export type State = {
	showAllTags: boolean
};
