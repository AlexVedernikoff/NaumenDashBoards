// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {Node} from 'react';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

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
	isEditable: boolean,
	isNew: boolean,
	isSelected: boolean,
	onDrillDown: (widget: Widget, orderNum?: number) => ThunkAction,
	onEdit: (id: string) => void,
	onRemove: (id: string) => void
};

export type State = {
	hasError: boolean
};

export type ExportItem = {
	key: string,
	text: string
};
