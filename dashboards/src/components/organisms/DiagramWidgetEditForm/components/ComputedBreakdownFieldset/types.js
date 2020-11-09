// @flow
import type {ComputedBreakdown} from 'store/widgets/data/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {ErrorsMap} from 'containers/WidgetEditForm/types';
import type {TransformAttribute} from 'DiagramWidgetEditForm/types';

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
