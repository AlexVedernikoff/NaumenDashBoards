// @flow
export type TreeSelectValue = {
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
	onChange: (name: string, value: TreeSelectValue) => any,
	placeholder: string,
	tree: Tree,
	value: TreeSelectValue | null
}
