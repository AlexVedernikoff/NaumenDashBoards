// @flow
import type {ViewData} from 'store/entity/types';

export type ConnectedProps = {
	dataDefaultView: ViewData | null,
	editingGlobal: boolean,
	personalViewData: ViewData[]
};

export type ConnectedFunctions = {
	changeEditingGlobal: (edit: boolean) => {},
	setDefaultViewData: (viewData: ViewData) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
