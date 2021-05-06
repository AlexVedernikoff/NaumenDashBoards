// @flow
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import {MODE} from './constraints';
import type {Props as ComponentProps} from 'containers/DiagramWidgetEditForm/components/SourceFieldset/types';

export type Props = ComponentProps & CommonDialogContextProps;

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
