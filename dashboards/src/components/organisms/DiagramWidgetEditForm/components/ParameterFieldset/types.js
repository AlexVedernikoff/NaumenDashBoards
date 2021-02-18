// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet, Parameter} from 'containers/DiagramWidgetEditForm/types';

export type Props = {
	dataSet: DataSet,
	dataSetIndex: number,
	disabled: boolean,
	disabledGroup: boolean,
	error: string,
	filter?: (options: Array<Attribute>, index: number) => Array<Attribute>,
	index: number,
	onChange: (dataSetIndex: number, index: number, value: Parameter) => void,
	onRemove?: (index: number) => void,
	removable: boolean,
	value: Parameter
};
