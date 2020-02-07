// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type Option = {
	attributes: Array<Attribute>,
	dataKey: string,
	source: SourceValue
};

export type Value = {
	aggregation: string,
	attribute: Attribute,
	dataKey: string,
	source: SourceValue
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
