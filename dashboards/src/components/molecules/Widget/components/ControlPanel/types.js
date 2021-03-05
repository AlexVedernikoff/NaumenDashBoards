// @flow
import type {DrillDown, OpenNavigationLink} from 'store/widgets/links/types';
import type {EditWidgetChunkData, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type Props = {
	className: string,
	editWidgetChunkData: EditWidgetChunkData,
	isEditable: boolean,
	onDrillDown: DrillDown,
	onEdit: () => void,
	onExport: (type: string) => Promise<void>,
	onOpenNavigationLink: OpenNavigationLink,
	onRemove: (id: string) => ThunkAction,
	widget: Widget
};

export type State = {
	showRemoveModal: boolean,
	showSubmenu: boolean
};
