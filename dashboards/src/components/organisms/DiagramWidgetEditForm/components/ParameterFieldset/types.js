// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {InjectedProps} from 'components/HOCs/withGetComponents/types';
import type {Parameter, SourceData} from 'containers/DiagramWidgetEditForm/types';

export type Props = InjectedProps & {
	dataKey: string,
	dataSetIndex: number,
	disabled: boolean,
	disabledGroup: boolean,
	error: string,
	filterOptions?: (filterByRef: boolean) => (options: Array<Attribute>, index: number) => Array<Attribute>,
	index: number,
	onChange: (dataSetIndex: number, index: number, value: Parameter) => void,
	onRemove?: (index: number) => void,
	removable: boolean,
	source: SourceData,
	value: Parameter
};
