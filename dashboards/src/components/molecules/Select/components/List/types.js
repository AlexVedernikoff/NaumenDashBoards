// @flow
type Messages = {
	noOptions?: string,
	notFound?: string
};

type Option = Object;

export type Props = {
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => string,
	itemSize: number,
	maxHeight: number,
	messages?: Messages,
	multiple: boolean,
	onClickShowMore?: () => void,
	onClose?: () => void,
	onSelect: (option: Option) => void,
	options: Array<Option>,
	searchValue: string,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
};

export type State = {
	options: Array<Option>,
	searchValue: string
};
