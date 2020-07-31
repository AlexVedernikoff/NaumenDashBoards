// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {DisplayMode, Widget} from 'store/widgets/data/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

type GridProps = {
	children?: Node,
	className: string,
	onMouseDown?: Function,
	onMouseUp?: Function,
	onTouchEnd?: Function,
	onTouchStart?: Function,
	style?: Object
};

export type Props = {
	...$Exact<GridProps>,
	buildData: BuildData,
	data: Widget,
	displayMode: DisplayMode,
	editWidgetChunkData: (Widget, Object) => Object | void,
	fetchBuildData: (widget: Widget) => ThunkAction,
	focused: boolean,
	isEditable: boolean,
	isNew: boolean,
	isSelected: boolean,
	layoutMode: string,
	onClick: (id: string) => void,
	onDrillDown: (widget: Widget, orderNum: number) => ThunkAction,
	onEdit: (id: string) => void,
	onRemove: (id: string) => ThunkAction,
	onUpdate: Widget => void,
	personalDashboard: boolean,
	user: UserData
};

export type State = {
	hasError: boolean,
	showRemoveModal: boolean
};

export type ExportItem = {
	key: string,
	text: string
};
