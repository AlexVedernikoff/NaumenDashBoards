// @flow
import type {ContextProps, OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';

export type Attribute = Object;

export type Source = {
	label: string,
	value: string
};

type DataSet = {
	dataKey: string,
	descriptor: string,
	source: Source
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
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onClickCreationButton?: () => void,
	onRemove?: (index: number) => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	removable: boolean,
	renderRefField?: (parent: Attribute | null) => React$Node,
	showCreationButton: boolean,
	value: Attribute | null
};

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};