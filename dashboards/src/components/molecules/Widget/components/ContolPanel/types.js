// @flow
import type {DrillDown} from 'store/widgets/links/types';
import type {EditWidgetChunkData, Widget} from 'store/widgets/data/types';
import {ThunkAction} from 'redux-thunk';
import type {UserData} from 'store/context/types';

export type Props = {
	className: string,
	editWidgetChunkData: EditWidgetChunkData,
	isEditable: boolean,
	onDrillDown: DrillDown,
	onEdit: () => void,
	onExport: (type: string) => Promise<void>,
	onRemove: (id: string) => ThunkAction,
	personalDashboard: boolean,
	user: UserData,
	widget: Widget
};

export type State = {
	showRemoveModal: boolean,
	showSubmenu: boolean
};
