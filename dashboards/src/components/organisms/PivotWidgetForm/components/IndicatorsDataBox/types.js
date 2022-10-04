// @flow
import type {DataSet, PivotIndicator} from 'store/widgetForms/pivotForm/types';

export type Props = {
	data: Array<DataSet>,
	onChange: (data: Array<DataSet>) => void,
	onChangeShowTotal: (value: boolean) => void,
	showTotal: boolean,
};

export type IndicatorValue = {
	dataKey: string,
	dataSetIndex: number,
	index: number,
	indicator: PivotIndicator
};

export type State = {
	disableTotalSum: boolean,
	values: Array<IndicatorValue>,
};
