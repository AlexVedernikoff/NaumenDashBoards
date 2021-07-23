// @flow
import type {Breakdown, BreakdownItem, SourceData} from 'store/widgetForms/types';
import type {InjectedProps as ValuesProps} from 'components/organisms/WidgetForm/HOCs/withValues/types';
import type {InjectedProps as HelpersProps} from 'containers/DiagramWidgetForm/HOCs/withHelpers/types';
import type {MixedAttribute, Source} from 'store/widgets/data/types';

type DataSet = {
	dataKey: string,
	source: SourceData
};

export type FieldContext = {
	breakdown: BreakdownItem,
	breakdownIndex: number,
	source: Source | null
};

type Values = {
	data: Array<DataSet>
};

export type Props = ValuesProps<Values> & HelpersProps & {
	className: string,
	dataKey: string,
	disabled: boolean,
	getUsedDataKeys?: (data: Array<DataSet>) => Array<string>,
	index: number,
	indicator: MixedAttribute | null,
	onChange: (value: Breakdown) => void,
	onRemove: () => void,
	removable: boolean,
	required: boolean,
	value: Breakdown
};
