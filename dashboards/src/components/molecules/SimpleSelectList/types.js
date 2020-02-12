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
	onSelect: (option: Option) => void,
	options: Array<Option>,
	value: Option | null,
	values: Array<Option>
};
