// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedFunctions = {
	onEditChunkData: (widget: AnyWidget, chunkData: Object) => ThunkAction,
	onRemove: (widgetId: string) => ThunkAction,
	onSelect: (widgetId: string, callback: Function) => ThunkAction
};

export type ConnectedProps = {
	editable: boolean
};
