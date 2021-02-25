// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {OnSelectEvent} from 'components/types';

export type Attribute = Object;

export type Source = {
	label: string,
	value: string
};

export type RefProps = {
	disabled: boolean,
	parent: Attribute | null,
	value: Attribute | null
};

export type Props = {
	...ContextProps,
	dataSet: DataSet,
	dataSetIndex: number,
	disabled: boolean,
	getAttributeOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	getSourceOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	index: number,
	name: string,
	onChangeLabel: (event: OnSelectEvent, index: number) => void,
	onClickCreationButton?: () => void,
	onRemove?: (index: number) => void,
	onSelect: (event: OnSelectEvent, index: number) => void,
	removable: boolean,
	renderRefField?: (parent: Attribute | null) => React$Node,
	showCreationButton: boolean,
	value: Attribute | null
};

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
