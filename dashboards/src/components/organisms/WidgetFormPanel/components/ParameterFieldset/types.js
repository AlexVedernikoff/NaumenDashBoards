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
	mainSet: DataSet,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number, mainSet: boolean) => void,
	set: DataSet,
	useGroup: boolean
};
