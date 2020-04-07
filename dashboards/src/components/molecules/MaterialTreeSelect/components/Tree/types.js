// @flow
import type {Value as SelectValue} from 'components/molecules/MaterialTreeSelect/types';

export type Node = {
	children: Array<string> | null,
	error: boolean,
	loading: boolean,
	root: boolean,
	uploaded: boolean,
	[string]: string
};

export type Tree = {
	[string]: Node
};

export type Value = Object;

export type Props = {
	className: string,
	getOptionLabel: (option: Node | null) => string,
	getOptionValue: (option: Node | null) => string,
	multiple: boolean,
	onLoad: (value: string | null, offset?: number) => void,
	onSelect: SelectValue => void,
	options: Tree,
	show: boolean,
	showMore: boolean,
	value: Value | null,
	values: Array<Value>
};

export type State = {
	expandedValues: Array<string>,
	foundValues: Array<string>,
	searchValue: string
};
