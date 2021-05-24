// @flow
import type {ComponentProps as TreeProps} from './components/Tree/types';
import type {OnSelectEvent, TreeNode} from 'components/types';
import type {Props as NodeProps} from './components/Node/types';

export type ContainerProps = {
	children: React$Node,
	className: string,
	onClick?: (e: SyntheticMouseEvent<HTMLDivElement>) => void
};

export type SearchInputProps = {
	focusOnMount: boolean,
	onChange: (value: string) => void,
	value: string
};

export type Option = Object;

export type Components = {
	IndicatorsContainer: React$ComponentType<ContainerProps>,
	LabelContainer: React$ComponentType<ContainerProps>,
	MenuContainer: React$ComponentType<ContainerProps>,
	Node: React$ComponentType<NodeProps>,
	SearchInput: React$ComponentType<SearchInputProps>,
	Tree: React$ComponentType<TreeProps>,
	ValueContainer: React$ComponentType<ContainerProps>,
};

export type Node = TreeNode<Option>;

export type Tree = {
	[string]: Node
};

export type Props = {
	className: string,
	components: $Shape<Components>,
	getNodeLabel?: (node: Node) => string,
	getNodeValue?: (node: Node) => string,
	getOptionLabel: (node: Option | null) => string,
	getOptionValue: (node: Option | null) => any,
	isDisabled: (node: Node) => boolean,
	loading: false,
	multiple: boolean,
	name: string,
	onFetch?: (node: Node | null, offset?: number) => void,
	onRemove?: (name: string) => void,
	onSelect: OnSelectEvent => void | Promise<void>,
	options: Tree,
	placeholder: string,
	removable: boolean,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
};

export type State = {
	searchValue: string,
	showMenu: boolean
};
