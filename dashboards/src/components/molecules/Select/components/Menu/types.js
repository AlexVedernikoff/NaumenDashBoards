// @flow
type CreationButton = {
	onClick: () => void,
	text: string
};

export type Props = {
	className: string,
	creationButton?: CreationButton,
	focusOnSearch: boolean,
	isSearching: boolean,
	renderList: (searchValue: string) => React$Node
};

export type State = {
	searchValue: string
};
