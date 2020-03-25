// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Source} from 'store/widgets/data/types';

export type Option = {
	attributes: Array<Attribute>,
	dataKey: string,
	source: Source
};

export type Value = {
	aggregation: string,
	attribute: Attribute,
	dataKey: string,
	source: Source
};

export type Props = {
	name: string,
	onClickButton: (name: string) => void,
	onSelect: (name: string, value: Value) => void,
	options: Array<Option>,
	value: Value | null
};

export type State = {
	active: boolean,
	expanded: Array<string>,
	foundOptions: Array<Option>,
	searchValue: string
};
