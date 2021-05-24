// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ControlType} from 'components/organisms/AttributeCreatingModal/types';
import type {Node, Tree} from 'components/molecules/TreeSelect/types';
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
	onAddConstant: (index: number, name: string) => void,
	onFetch: (node: Node) => void,
	onSelect: (index: number, name: string, value: Value, type: ControlType) => void,
	options: Tree,
	value: Value | null
};
