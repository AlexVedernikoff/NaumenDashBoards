// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {ThunkAction} from 'store/types';

export type Components = {
	Container: React$ComponentType<ContainerProps>,
	DropdownMenu: React$ComponentType<{
		children: React$Node
	}>
};

export type Props = {
	className: string,
	components: Components,
	editable: boolean,
	onEditChunkData: (widget: AnyWidget, chunkData: Object) => ThunkAction,
	onRemove: (widgetId: string) => ThunkAction,
	onSelect: (widgetId: string, callback: Function) => ThunkAction,
	widget: AnyWidget,
};

export type State = {
	showRemoveModal: boolean,
	showSubmenu: boolean
};
