// @flow
import type {Attribute} from 'WidgetFormPanel/components/AttributeFieldset/types';
import type {DiagramDataSet, Parameter, SourceData} from 'store/widgetForms/types';
import type {InjectedProps} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers/types';

export type Props = InjectedProps & {
	dataKey: string,
	dataSetIndex: number,
	dataSets: Array<DiagramDataSet>,
	disabled: boolean,
	disabledGroup: boolean,
	filterOptions?: (Array<Attribute>, index: number, filterByRef: boolean) => Array<Attribute>,
	index: number,
	onChange: (dataSetIndex: number, index: number, value: Parameter, callback?: Function) => void,
	onChangeDataSet?: (index: number, dataSetIndex: number, callback?: Function) => void,
	onRemove?: (index: number) => void,
	removable: boolean,
	source: SourceData,
	value: Parameter
};
