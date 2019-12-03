// @flow
import type {DiagramData} from 'store/widgets/diagrams/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	data: Widget,
	diagram: DiagramData,
	isEditable: boolean,
	isNew: boolean,
	isSelected: boolean,
	onDrillDown: (widget: Widget, orderNum?: number) => void,
	onEdit: (id: string) => void,
	onRemove: (id: string) => void
}

export type ExportItem = {
	key: string,
	text: string
}
