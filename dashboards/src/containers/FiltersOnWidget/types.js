// @flow
import type {Attribute} from 'src/store/sources/attributes/types';
import type {
	AxisData,
	CircleData,
	ComboData,
	SourceData,
	SummaryData,
	TableData
} from 'src/store/widgets/data/types';
import type {SetFieldValue, Values} from 'components/organisms/WidgetForm/types';
import type {ThunkAction} from 'store/types';

export type DataSetTypes = Array<AxisData>
	| Array<CircleData>
	| Array<ComboData>
	| Array<SummaryData>
	| Array<TableData>;

export type CustomFilterValue = {
	attributes: ?Attribute[],
	dataSetIndex: ?number,
	label: string,
};

export type CustomFilterDataSet = {
	attributes: Attribute[],
	attributesLoading: boolean,
	dataSetIndex: number,
	parentClassFqn: null | string,
	source: SourceData,
};

export type ConnectedFunctions = {
	fetchAttributesForFilters: (
		classFqn: string,
		parentClassFqn: ?string,
		attrGroupCode: string
	) => ThunkAction
};

export type ConnectedProps = {
	availableFiltersOnWidget: boolean,
	dataSets: CustomFilterDataSet[],
	initialCustomFiltersValues: CustomFilterValue[]
};

export type ContainerProps = {
	onChange: SetFieldValue,
	values: Values
};

export type Props = ConnectedFunctions & ConnectedProps & ContainerProps & {
	raiseErrors: (errors: {[path: string]: string}) => void
};

export type State = {
	filters: CustomFilterValue[]
};
