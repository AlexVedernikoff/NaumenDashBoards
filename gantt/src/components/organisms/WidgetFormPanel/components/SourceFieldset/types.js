// @flow
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import type {DataSet, Props as ContainerProps} from 'containers/SourceFieldset/types';
import {MODE} from './constraints';

export type Props = CommonDialogContextProps & ContainerProps & {
	index: number,
	onChange: (index: number, dataSet: DataSet) => void,
	onOpenFilterForm: () => Promise<string>,
	value: DataSet,
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
