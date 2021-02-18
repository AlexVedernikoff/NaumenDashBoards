// @flow
import type {ComputedBreakdown, DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {ErrorsMap} from 'containers/WidgetEditForm/types';

export type Props = {
	data: Array<DataSet>,
	errors: ErrorsMap,
	index: number,
	name: string,
	onChange: (index: number, name: string, value: ComputedBreakdown) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	value: ComputedBreakdown
};
