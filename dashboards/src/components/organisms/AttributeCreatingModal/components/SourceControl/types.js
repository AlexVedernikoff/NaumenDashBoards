// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ControlType, SourceOption} from 'components/organisms/AttributeCreatingModal/types';
import type {Source} from 'store/widgets/data/types';

export type Value = {
	aggregation: string,
	attribute: Attribute,
	dataKey: string,
	source: Source
};

export type Props = {
	index: number,
	name: string,
	onClickButton: (index: number, name: string) => void,
	onSelect: (index: number, name: string, value: Value, type: ControlType) => void,
	options: Array<SourceOption>,
	type: ControlType,
	value: Value | null
};

export type State = {
	expanded: Array<string>,
	foundOptions: Array<SourceOption>,
	searchValue: string,
	showList: boolean
};
