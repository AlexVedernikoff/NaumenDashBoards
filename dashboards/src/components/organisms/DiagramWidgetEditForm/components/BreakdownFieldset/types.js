// @flow
import type {Breakdown, DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {ErrorsMap} from 'containers/WidgetEditForm/types';
import type {MixedAttribute} from 'src/store/widgets/data/types';

export type Props = {
	data: Array<DataSet>,
	errors: ErrorsMap,
	index: number,
	indicator: MixedAttribute | null,
	onChange: (value: Breakdown) => void,
	onRemove: () => void,
	removable: boolean,
	value: Breakdown
};
