// @flow
type Option = Object;

export type DefaultProps = {|
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	itemSize: number,
	maxHeight: number,
	multiple: boolean,
	searchValue: string,
	showMore: false,
	value: Option | null,
	values: Array<Option>
|};

export type Props = {
	...DefaultProps,
	onClickShowMore?: () => void,
	onSelect: (option: Option) => void,
	options: Array<Option>,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
