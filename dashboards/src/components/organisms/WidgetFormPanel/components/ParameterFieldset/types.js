// @flow
import type {Attribute} from 'WidgetFormPanel/components/AttributeFieldset/types';
import type {InjectedProps} from 'containers/DiagramWidgetForm/HOCs/withHelpers/types';
import type {Parameter, SourceData} from 'store/widgetForms/types';

export type Props = InjectedProps & {
	dataKey: string,
	dataSetIndex: number,
	disabled: boolean,
	disabledGroup: boolean,
	filterOptions?: (Array<Attribute>, index: number, filterByRef: boolean) => Array<Attribute>,
	index: number,
	onChange: (dataSetIndex: number, index: number, value: Parameter) => void,
	onRemove?: (index: number) => void,
	removable: boolean,
	source: SourceData,
	value: Parameter
};
