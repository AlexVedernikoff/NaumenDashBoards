// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {SetDataFieldValue} from 'containers/WidgetFormPanel/types';

export type Props = {
	errors: Object,
	index: number,
	onChange: SetDataFieldValue,
	onChangeCompute: (index: number, event: OnChangeInputEvent) => void,
	onRemove: (index: number) => void,
	onSelectSource: (index: number, event: OnSelectEvent) => void,
	removable: boolean,
	set: Object,
	sources: DataSourceMap
};

export type State = {
	showForm: boolean,
	showList: boolean
};
