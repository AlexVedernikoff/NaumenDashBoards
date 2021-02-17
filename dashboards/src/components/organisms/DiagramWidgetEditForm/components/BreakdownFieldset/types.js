// @flow
import type {DataSet, DefaultBreakdown} from 'containers/DiagramWidgetEditForm/types';

export type Props = {
	dataSet: DataSet,
	dataSetIndex: number,
	error: string,
	name: string,
	onChange: (index: number, value: DefaultBreakdown) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	value: DefaultBreakdown
};
