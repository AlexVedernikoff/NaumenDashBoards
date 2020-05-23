// @flow
import type {TreeNode} from 'components/types';

export type NodeValue = Object;

export type Node = TreeNode<Object>;

export type Tree = {
	[string]: Node
};

export type Props = {
	className: string,
	getOptionLabel: (option: Node | null) => string,
	getOptionValue: (option: Node | null) => string,
	initialSelected: Array<string>,
	isDisabled?: NodeValue => boolean,
	multiple: boolean,
	onLoad?: (value: NodeValue | null, offset?: number) => void,
	onSelect: Node => void,
	options: Tree,
	show: boolean,
	showMore: boolean,
	value: NodeValue | null,
	values: Array<NodeValue>
};

export type State = {
	expandedNodes: Array<string>,
	foundIds: Array<string>,
	searchValue: string,
	selectedIds: Array<string>
};
