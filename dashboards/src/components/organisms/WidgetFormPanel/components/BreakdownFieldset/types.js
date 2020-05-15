// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, OnSelectAttributeEvent} from 'WidgetFormPanel/types';

export type Props = {
	error: string,
	getAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	getSourceOptions: (classFqn: string) => Array<Attribute>,
	index: number,
	name: string,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemove: (index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	removable: boolean,
	set: DataSet
};
