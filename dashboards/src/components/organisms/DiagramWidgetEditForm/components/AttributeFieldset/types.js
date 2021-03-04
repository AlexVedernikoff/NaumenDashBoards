// @flow
import type {OnSelectEvent} from 'components/types';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';

export type Attribute = Object;

export type RefProps = {
	disabled: boolean,
	parent: Attribute | null,
	value: Attribute | null
};

export type Props = {
	dataKey: string,
	dataSetIndex: number,
	disabled: boolean,
	getAttributeOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	getSourceOptions?: (Array<Attribute>, index: number) => Array<Attribute>,
	index: number,
	name: string,
	onChangeLabel: (event: OnSelectEvent, index: number) => void,
	onRemove?: (index: number) => void,
	onSelect: (event: OnSelectEvent, index: number) => void,
	removable: boolean,
	source: SourceData,
	value: Attribute | null
};

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
