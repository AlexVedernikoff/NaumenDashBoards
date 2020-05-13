// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {ErrorsMap, SetDataFieldValue, SetFieldValue} from 'containers/WidgetFormPanel/types';
import type {WidgetType} from 'store/widgets/data/types';

export type Props = {
	data: Array<Object>,
	errors: ErrorsMap,
	minCountBuildingSources: number,
	onSelectCallback: (parameterName: string) => () => void,
	parameterName: string,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	sourceRefFields: Array<string>,
	sources: DataSourceMap,
	type: WidgetType
};
