// @flow
import type {Components} from './components/AttributeSelect/types';
import type {OnSelectEvent} from 'components/types';
import type {SourceData} from 'store/widgetForms/types';

export type Attribute = Object;

export type GetAttributeOptions = (Array<Attribute>, index: number) => Array<Attribute>;

export type Props = {
	components: Components,
	dataKey: string,
	dataSetIndex: number,
	disabled: boolean,
	getMainOptions?: GetAttributeOptions,
	getRefOptions?: GetAttributeOptions,
	index: number,
	name: string,
	onChangeLabel: (event: OnSelectEvent, index: number, callback?: Function) => void,
	onRemove?: (index: number) => void,
	onSelect: (event: OnSelectEvent, index: number) => void,
	refComponents: ?Components,
	removable: boolean,
	source: SourceData,
	value: Attribute | null
};

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
