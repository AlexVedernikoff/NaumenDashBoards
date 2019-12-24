// @flow
export type TreeSelectValue = {
	label: string,
	value: string
}

export type Node = {
	children: Array<string>,
	errorLoadingChildren?: boolean,
	isLeaf: boolean,
	key: string,
	root?: boolean,
	title: string,
	value: string,
	[string]: any
}

export type Tree = {
	[string]: Node
}

export type Props = {
	name: string,
	onChange: (name: string, value: TreeSelectValue | null) => any,
	onChangeLabel: (name: string, value: string) => void,
	placeholder: string,
	tree: Tree,
	value: TreeSelectValue | null
}

export type State = {
	showForm: boolean
};
