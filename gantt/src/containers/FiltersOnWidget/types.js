// @flow
import type {Attribute, FetchAttributes} from 'src/store/sources/attributes/types';
import type {AxisData, CircleData, ComboData, SourceData, SummaryData, TableData} from 'src/store/widgets/data/types';
import type {SetFieldValue, Values} from 'components/organisms/WidgetForm/types';

export type DataSetTypes = Array<AxisData> | Array<CircleData> | Array<ComboData> | Array<SummaryData> | Array<TableData>;

export type CustomFilterValue = {
	attributes: ?Attribute[],
	dataSetIndex: ?number,
	label: string,
};

export type CustomFilterDataSet = {
	attributes: Attribute[],
	attributesLoading: boolean,
	dataSetIndex: number,
	source: SourceData,
};

export type ConnectedFunctions = {
	fetchAttributes: FetchAttributes
};

export type ConnectedProps = {
	dataSets: CustomFilterDataSet[],
	initialCustomFiltersValues: CustomFilterValue[]
};

export type ContainerProps = {
	onChange: SetFieldValue,
	values: Values
};

export type Props = ConnectedFunctions & ConnectedProps & ContainerProps;

export type State = {
	filters: CustomFilterValue[]
};
