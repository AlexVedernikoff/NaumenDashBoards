// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisData, CircleData, ComboData, SourceData, SummaryData, TableData, Widget} from 'store/widgets/data/types';
import type {FetchAttributes} from 'containers/DiagramWidgetEditForm/types';
import type {
	SetDataFieldValue,
	SetFieldValue
} from 'containers/WidgetEditForm/types';

export type DataSetTypes = Array<AxisData> | Array<CircleData> | Array<ComboData> | Array<SummaryData> | Array<TableData>;

export type CustomFilterValue = {
	attribute: ?Attribute,
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
};

export type ConnectedProps = {
	dataSets: CustomFilterDataSet[],
	initialCustomFiltersValues: CustomFilterValue[]
};

export type ContainerProps = {
	fetchAttributes: FetchAttributes,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	values: Widget
};

export type Props = ConnectedFunctions & ConnectedProps & ContainerProps;

export type State = {
	filters: CustomFilterValue[],
};
