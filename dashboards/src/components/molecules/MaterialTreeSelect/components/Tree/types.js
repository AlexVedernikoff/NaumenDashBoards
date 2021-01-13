// @flow
import type {Props as NodeProps} from 'components/molecules/MaterialTreeSelect/components/Node/types';
import type {TreeNode} from 'components/types';

export type NodeValue = Object;

export type Node = TreeNode<Object>;

export type Tree = {
	[string]: Node
};

type Components = {
	Node: React$ComponentType<NodeProps>,
};

export type Props = {
	components: Components,
	getOptionLabel: (option: Node | null) => string,
	getOptionValue: (option: Node | null) => string,
	initialSelected: Array<string>,
	isEnabledNode?: NodeValue => boolean,
	loading: boolean,
	multiple: boolean,
	onLoad?: (value: NodeValue | null, offset?: number) => void,
	onSelect: Node => void,
	options: Tree,
	searchValue: string,
	show: boolean,
	showMore: boolean,
	value: NodeValue | null,
	values: Array<NodeValue>
};

export type State = {
	foundIds: Array<string>,
	selectedIds: Array<string>
};
