// @flow
import type {ComputedAttr, TableData} from 'src/store/widgets/data/types';
import type {DiagramDataSet, Indicator, SourceData} from 'store/widgetForms/types';
import type {InjectedProps as ValuesProps} from 'components/organisms/WidgetForm/HOCs/withValues/types';
import type {InjectedProps as HelpersProps} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers/types';
import type {InjectedProps as TypeProps} from 'WidgetFormPanel/HOCs/withType/types';
import type {InjectedProps as OpenFormProps} from 'containers/FilterForm/types';
import type {OnSelectEvent} from 'components/types';

type ValuesPropsParams = {
	computedAttrs: Array<ComputedAttr>,
	data: Array<TableData>
};

export type Props = TypeProps & ValuesProps<ValuesPropsParams> & HelpersProps & OpenFormProps & {
	className: ?string,
	dataKey: string,
	dataSetIndex: number,
	dataSets: Array<DiagramDataSet>,
	hasFiltered: boolean,
	hasInterestRelative: boolean,
	index: number,
	onChange: (index: number, indicator: Indicator, callback?: Function) => void,
	onChangeDataSet?: (index: number, dataSetIndex: number, data: DiagramDataSet, callback?: Function) => void,
	onChangeLabel: (event: OnSelectEvent, index: number) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	source: SourceData,
	usesNotApplicableAggregation: boolean,
	value: Indicator
};

export type State = {
	showCreatingModal: boolean,
	showSelectionModal: boolean
};
