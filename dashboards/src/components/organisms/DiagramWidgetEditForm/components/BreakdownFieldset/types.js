// @flow
import type {Breakdown, DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {ErrorsMap} from 'containers/WidgetEditForm/types';
import type {MixedAttribute} from 'store/widgets/data/types';

export type Props = {
	data: Array<DataSet>,
	errors: ErrorsMap,
	getUsedDataKeys: (data: Array<DataSet>) => Array<string>,
	index: number,
	indicator: MixedAttribute | null,
	onChange: (value: Breakdown) => void,
	onRemove: () => void,
	removable: boolean,
	value: Breakdown
};
