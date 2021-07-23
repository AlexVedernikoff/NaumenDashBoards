// @flow

import type {Attribute} from 'store/sources/attributes/types';
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/FiltersOnWidget/types';

export type Props = {
	dataSets: CustomFilterDataSet[],
	fetchAttributes: (dataSetIndex: number) => void,
	onChangeAttribute: (newAttributes: Attribute[]) => void,
	onChangeDataSet: (newDataKey: string) => void,
	onChangeLabel: (newLabel: string) => void,
	onDelete: () => void,
	value: CustomFilterValue,
};
