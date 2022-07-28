// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {IndicatorGrouping} from 'store/widgets/data/types';

export type Props = {
	data: Array<DataSet>,
	onChange: (value: IndicatorGrouping | null) => void,
	value: IndicatorGrouping | null,
};

export type State = {
	showModal: boolean,
	value: IndicatorGrouping | null
};
