// @flow
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/DiagramWidgetEditForm/components/FiltersOnWidget/types';

export type Props = {
	dataSets: CustomFilterDataSet[],
	fetchAttributes: (dataSetIndex: number) => void,
	filters: CustomFilterValue[],
	onAddNewFilterItem: () => void,
	onChangeFilter: (idx: number, filter: CustomFilterValue) => void,
	onDeleteFilter: (idx: number) => void,
};
