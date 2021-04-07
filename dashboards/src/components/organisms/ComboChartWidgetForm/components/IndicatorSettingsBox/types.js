// @flow
import type {ComboIndicatorSettings} from 'store/widgets/data/types';
import type {DataSet} from 'store/widgetForms/comboChartForm/types';
import type {OnChangeEvent} from 'components/types';

export type Props = {
	data: Array<DataSet>,
	name: string,
	onChange: (name: string, value: ComboIndicatorSettings) => void,
	onChangeYAxisName: (index: number) => (event: OnChangeEvent<string>) => void,
	value: ComboIndicatorSettings
};

export type State = {
	showAdditionalSettings: boolean
};
