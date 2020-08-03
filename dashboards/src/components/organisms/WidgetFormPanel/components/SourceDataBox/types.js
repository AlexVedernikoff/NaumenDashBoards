// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {
	ErrorsMap,
	FetchAttributes,
	SetDataFieldValue,
	SetFieldValue
} from 'containers/WidgetFormPanel/types';
import type {WidgetType} from 'store/widgets/data/types';

export type SourceRefFields = $Shape<{
	breakdown: string,
	indicator: string,
	parameter: string
}>;

export type Props = {
	data: Array<Object>,
	errors: ErrorsMap,
	fetchAttributes: FetchAttributes,
	minCountBuildingSources: number,
	onSelectCallback: (parameterName: string) => () => void,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sourceRefFields: SourceRefFields,
	sources: DataSourceMap,
	type: WidgetType
};
