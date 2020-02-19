// @flow
type CreationButton = {
	onClick: () => void,
	text: string
};

export type Props = {
	creationButton?: CreationButton,
	getOptionLabel?: (option: Object) => string,
	getOptionValue?: (option: Object) => string,
	isSearching: boolean,
	multiple: boolean,
	onClickShowMore?: () => void,
	onClose: () => void,
	onSelect: (value: Object) => void,
	options: Array<Object>,
	showMore: boolean,
	value: Object | null,
	values: Array<Object>
};

export type State = {
	foundOptions: Array<Object>,
	searchValue: string
};
