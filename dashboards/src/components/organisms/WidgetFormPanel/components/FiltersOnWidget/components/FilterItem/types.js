// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/FiltersOnWidget/types';
import type {SubscribeContext} from 'components/organisms/WidgetForm/HOCs/withSubscriptions/types';

export type Props = SubscribeContext & {
	dataSets: CustomFilterDataSet[],
	fetchAttributes: (dataSetIndex: number) => void,
	idx: number,
	onChangeAttribute: (newAttributes: Attribute[], callback?: Function) => void,
	onChangeDataSet: (newDataKey: string, callback?: Function) => void,
	onChangeLabel: (newLabel: string, callback?: Function) => void,
	onDelete: () => void,
	value: CustomFilterValue,
};

export type State = {
	isEditLabel: boolean
};
