// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {ParameterOrder} from 'store/widgetForms/types';

export type Props = {
	data: Array<DataSet>,
	onChange: (parameters: Array<ParameterOrder>) => void,
	onChangeShowTotal: (value: boolean) => void,
	showTotal: boolean,
	value: Array<ParameterOrder>
};

export type State = {
	disableTotalSum: boolean,
};
