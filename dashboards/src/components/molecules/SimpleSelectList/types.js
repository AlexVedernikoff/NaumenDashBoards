// @flow
type Messages = {
	noOptions?: string,
	notFound?: string
}

export type Props = {
	getOptionLabel?: (option: Object) => string,
	getOptionValue?: (option: Object) => string,
	isSearching: boolean,
	messages?: Messages,
	onSelect: (option: Object) => void,
	options: Array<Object>,
	value: Object | null
}
