// @flow
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/FiltersOnWidget/types';

export type Props = {
	dataSets: CustomFilterDataSet[],
	filters: CustomFilterValue[],
	onAddNewFilterItem: () => void,
	onChangeFilter: (idx: number, filter: CustomFilterValue, callback?: Function) => void,
	onDeleteFilter: (idx: number) => void,
};
