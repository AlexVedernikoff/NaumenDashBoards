// @flow
import type {BreakdownItem, Parameter} from 'store/widgetForms/types';
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import type {DataSet, Props as ContainerProps} from 'containers/SourceFieldset/types';
import {MODE} from './constraints';

type FetchAttributesByCode = (
		classFqn: string | null,
		parameters: Array<Parameter | BreakdownItem>,
		defaultItem: Parameter | BreakdownItem
	) => Promise<Array<Parameter | BreakdownItem>>;

export type Props = CommonDialogContextProps & ContainerProps & {
	fetchAttributesByCode: FetchAttributesByCode,
	index: number,
	onChange: (index: number, dataSet: DataSet, callback?: Function) => void,
	onOpenFilterForm: () => Promise<string>,
	value: DataSet
};

export type ConfirmOption = {
	notice: boolean,
	resolve: (boolean) => void,
	text: string,
	title: string,
};

export type State = {
	error: ?string,
	mode: ?$Keys<typeof MODE>,
	showEditForm: boolean,
};
