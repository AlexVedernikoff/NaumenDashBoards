// @flow
import type {DiagramDataSet} from 'store/widgetForms/types';

export type Props = {
	onChange: (name: string, data: boolean) => void,
	showSubTotalAmount: boolean,
	showTotalAmount: boolean,
	subTotalAmountView: boolean,
	values: {data: Array<DiagramDataSet>}
};
