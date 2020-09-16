// @flow
import type {DataSet, SetDataFieldValue} from 'containers/WidgetFormPanel/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {SourceRefFields} from 'WidgetFormPanel/builders/DataFormBuilder/types';

export type Props = {
	error: string,
	index: number,
	onChange: SetDataFieldValue,
	onChangeCompute: (index: number, event: OnChangeInputEvent) => void,
	onChangeDescriptor: (index: number, descriptor: string) => void,
	onRemove: (index: number) => void,
	onSelectSource: (index: number, event: OnSelectEvent, sourceRefFields: SourceRefFields) => void,
	removable: boolean,
	set: DataSet,
	sourceRefFields: SourceRefFields,
	sources: DataSourceMap,
	useFilter: boolean
};

export type State = {
	showForm: boolean,
	showList: boolean
};
