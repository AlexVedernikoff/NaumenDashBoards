// @flow
import type {AddNewWidgetAction, DisplayMode} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	canShowCopyPanel: boolean,
	newWidgetDisplay: DisplayMode,
|};

export type ConnectedFunctions = {|
	addNewWidget: AddNewWidgetAction,
	showCopyPanel: () => ThunkAction,
|};

export type Props = ConnectedFunctions & ConnectedProps;
