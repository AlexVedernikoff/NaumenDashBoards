// @flow
export type Item = {
	label: string,
	value: string
};

export type Props = {
	className: string,
	item: Item,
	onClick: (item: Item) => void
};
