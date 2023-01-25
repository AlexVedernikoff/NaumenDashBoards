// @flow
import type {AddNewWidgetAction} from 'store/widgets/data/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	canShowCopyPanel: boolean,
	layoutMode: LayoutMode,
|};

export type ConnectedFunctions = {|
	addNewWidget: AddNewWidgetAction,
	showCopyPanel: () => ThunkAction,
|};

export type Props = ConnectedFunctions & ConnectedProps;
