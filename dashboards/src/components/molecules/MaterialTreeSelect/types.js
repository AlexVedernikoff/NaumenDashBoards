// @flow
import type {NodeValue, Tree} from './components/Tree/types';

export type Value = Object;

export type Props = {
	async: boolean,
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
	optionsLoaded: boolean,
	showMenu: boolean
};
