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
	fetch: () => any,
	items: Array<Item>,
	loading: boolean,
	onSelect: (child: Child) => any,
	uploaded: boolean
};

export type State = {
	searchValue: string
};
