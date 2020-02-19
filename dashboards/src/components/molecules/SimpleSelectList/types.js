// @flow
type Messages = {
	noOptions?: string,
	notFound?: string
};

type Option = Object;

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => string,
	isSearching: boolean,
	messages?: Messages,
	multiple: boolean,
	onClickShowMore?: () => void,
	onClose: () => void,
	onSelect: (option: Option) => void,
	options: Array<Option>,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
};
