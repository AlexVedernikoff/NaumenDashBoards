// @flow
export type Item = any;

export type Props = {
	list: Array<Item>,
	onChangeOrder: (Array<Item>) => void,
	renderItem: (item: Item, index: number, items: Array<Item>) => React$Node
};

export type State = {
	disabled: boolean
};
