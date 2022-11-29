// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet, PivotIndicator} from 'store/widgetForms/pivotForm/types';

export type Props = {
	data: Array<DataSet>;
	fetchAttributeByCode: (classFqn: string, attribute: Attribute) => Promise<Attribute>,
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
	values: Array<IndicatorValue>,
};
