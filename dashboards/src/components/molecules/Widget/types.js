// @flow
import type {AnyWidget, EditWidgetChunkData, Widget} from 'store/widgets/data/types';
import type {BuildData} from 'store/widgets/buildData/types';
import type {DivRef} from 'src/components/types';
import type {DrillDown, OpenCardObject, OpenNavigationLink} from 'store/widgets/links/types';
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
	editWidgetChunkData: EditWidgetChunkData,
	fetchBuildData: (widget: Widget) => ThunkAction,
	focused: boolean,
	isEditable: boolean,
	isNew: boolean,
	isSelected: boolean,
	layoutMode: string,
	onClick: (e: SyntheticMouseEvent<HTMLDivElement>, widget: AnyWidget) => void,
	onDrillDown: DrillDown,
	onEdit: (id: string, ref: DivRef) => void,
	onFocus: (element: HTMLDivElement) => void,
	onOpenCardObject: OpenCardObject,
	onOpenNavigationLink: OpenNavigationLink,
	onRemove: (id: string) => ThunkAction,
	onUpdate: Widget => void,
	personalDashboard: boolean,
	user: UserData
};

export type State = {
	hasError: boolean
};
