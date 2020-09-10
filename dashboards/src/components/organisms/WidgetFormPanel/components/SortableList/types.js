// @flow
type Item = any;

export type Props = {
	list: Array<Item>,
	onChangeOrder: (Array<Item>) => void,
	renderItem: (item: Item, index: number) => React$Node
};

export type State = {
	disabled: boolean
};
