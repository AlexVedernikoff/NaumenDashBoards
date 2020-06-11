// @flow
import type {ComputedBreakdown} from 'store/widgets/data/types';
import type {DataSet, ErrorsMap} from 'containers/WidgetFormPanel/types';
import type {TransformAttribute} from 'WidgetFormPanel/types';

export type Props = {
	data: Array<DataSet>,
	errors: ErrorsMap,
	index: number,
	name: string,
	onChange: (index: number, name: string, value: ComputedBreakdown) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	transformAttribute: TransformAttribute,
	value: ComputedBreakdown
};
