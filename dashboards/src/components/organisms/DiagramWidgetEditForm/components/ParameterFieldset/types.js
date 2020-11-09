// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {Group} from 'store/widgets/data/types';
import type {OnChangeAttributeLabelEvent, OnChangeGroup, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';

export type Props = {
	dataSet: DataSet,
	disabled: boolean,
	disabledGroup: boolean,
	error: string,
	filter?: (options: Array<Attribute>, index: number) => Array<Attribute>,
	group: Group,
	index: number,
	name: string,
	onChangeGroup: OnChangeGroup,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onRemove?: (index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	removable: boolean,
	value: Attribute
};
