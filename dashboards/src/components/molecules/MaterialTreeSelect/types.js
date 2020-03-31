// @flow
import type {Tree} from './components/Tree/types';

export type Value = {
	label: string,
	value: string
};

export type Option = Object;

export type Props = {
	async: boolean,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	multiple: boolean,
	name: string,
	onClear?: () => void,
	onLoadMore: (value: string | null, offset: number) => void,
	onLoadNode: (value: string) => void,
	onLoadOptions: () => void,
	onRemove?: (value: string) => void,
	onSelect: (name: string, value: Value) => void,
	options: Tree,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
};

export type State = {
	optionsLoaded: boolean,
	showMenu: boolean
};
