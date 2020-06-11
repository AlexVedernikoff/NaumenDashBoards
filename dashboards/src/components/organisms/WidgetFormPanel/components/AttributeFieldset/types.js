// @flow
import type {ContextProps, OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';

export type Attribute = Object;

export type Source = {
	label: string,
	value: string
};

export type Props = {
	...ContextProps,
	disabled: boolean,
	getAttributeOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	getSourceOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	index: number,
	name: string,
	onChangeLabel: (event: OnChangeAttributeLabelEvent, index: number) => void,
	onClickCreationButton?: () => void,
	onRemove?: () => void,
	onSelect: (event: OnSelectAttributeEvent, index: number) => void,
	removable: boolean,
	renderRefField?: (parent: Attribute | null) => React$Node,
	showCreationButton: boolean,
	source: Source,
	value: Attribute | null
};
