// @flow
export type Form = {
	onSubmit: (name: string, value: string) => any,
	rule?: any,
	value: string | number
};

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
	form?: Form,
	name: string,
	onChange: (name: string, value: TreeSelectValue | null) => any,
	placeholder: string,
	tree: Tree,
	value: TreeSelectValue | null
}

export type State = {
	showForm: boolean
};
