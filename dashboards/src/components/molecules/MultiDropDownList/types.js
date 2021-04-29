// @flow
export type Node = {
	label: string,
	value: string,
	...Object
};

export type Root = {
	...Node,
	children: Array<Node>
};

export type Value = {
	...Node,
	parent?: Node
};

export type Props = {
	className: string,
	items: Array<Root>,
	loading: boolean,
	onFocusSearchInput?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	onSelect: (value: Value) => any
};

export type State = {
	searchValue: string
};
