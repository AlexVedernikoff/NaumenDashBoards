// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {ParameterOrder} from 'store/widgetForms/types';

export type Props = {
	data: Array<DataSet>,
	disableShowTotal: boolean,
	onChange: (parameters: Array<ParameterOrder>) => void,
	onChangeShowTotal: (value: boolean) => void,
	showTotal: boolean,
	value: Array<ParameterOrder>
};
