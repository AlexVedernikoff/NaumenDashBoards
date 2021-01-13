// @flow
import type {ComponentProps as SearchInputComponentProps} from 'components/atoms/SearchInput/types';
import type {NodeValue, Tree} from './components/Tree/types';
import type {Props as NodeProps} from './components/Node/types';

export type Value = Object;

export type Components = {
	Node: React$ComponentType<NodeProps>,
	SearchInput: React$ComponentType<SearchInputComponentProps>;
};

export type Props = {
	async: boolean,
	components?: $Shape<Components>,
	getOptionLabel?: (option: NodeValue) => string,
	getOptionValue?: (option: NodeValue) => any,
	isEnabledNode?: NodeValue => boolean,
	loading: boolean,
	multiple: boolean,
	name: string,
	onClear?: () => void,
	onLoad: (value: NodeValue | null, offset?: number) => void,
	onRemove?: (value: string) => void,
	onSelect: (name: string, value: Value) => void,
	options: Tree,
	showMore: boolean,
	value: Value | null,
	values: Array<Value>
};

export type State = {
	components: Components,
	optionsLoaded: boolean,
	searchValue: string,
	showMenu: boolean
};
