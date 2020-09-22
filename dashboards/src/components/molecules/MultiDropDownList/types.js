// @flow

type Child = {
	label: string,
	value: string
};

export type Item = {
	children: Array<Child>,
	label: string,
	value: string
};

export type Props = {
	items: Array<Item>,
	loading: boolean,
	onFocusSearchInput: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	onSelect: (child: Child) => any
};

export type State = {
	searchValue: string
};
