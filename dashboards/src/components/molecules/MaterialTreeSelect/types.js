// @flow
import type {Tree} from './components/Tree/types';

export type Value = Object;

export type Option = Object;

export type Props = {
	async: boolean,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	multiple: boolean,
	name: string,
	onClear?: () => void,
	onLoad: (value: string | null, offset?: number) => void,
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
