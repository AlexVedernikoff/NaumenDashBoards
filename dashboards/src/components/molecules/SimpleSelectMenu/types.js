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
	onSelect: (value: Object) => void,
	options: Array<Object>,
	value: Object | null
};

export type State = {
	foundOptions: Array<Object>,
	searchValue: string
};
