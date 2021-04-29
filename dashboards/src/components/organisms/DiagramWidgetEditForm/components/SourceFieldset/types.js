// @flow
import {MODE} from './constraints';
import type {Props as ComponentProps} from 'containers/DiagramWidgetEditForm/components/SourceFieldset/types';

export type Props = ComponentProps;

export type ConfirmOption = {
	notice: boolean,
	resolve: (boolean) => void,
	text: string,
	title: string,
};

export type State = {
	confirmOption: ?ConfirmOption;
	errorMessage: ?string,
	mode: ?$Keys<typeof MODE>,
	showEditForm: boolean,
};
