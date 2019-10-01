// @flow
export type SelectValue = {
	label: string,
	value: string
}

export type Node = {
	children: Array<string>,
	isLeaf: boolean,
	root?: boolean,
	title: string,
	value: string,
}

export type Tree = {
	[string]: Node
}

export type Props = {
	name: string,
	onChange: (name: string, value: SelectValue) => any,
	placeholder: string,
	tree: Tree,
	value: SelectValue | null
}
