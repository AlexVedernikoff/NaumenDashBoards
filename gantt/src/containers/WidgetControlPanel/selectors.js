// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editWidgetChunkData, removeWidget, selectWidget} from 'store/widgets/data/actions';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const editable = context.user.role !== USER_ROLES.REGULAR || dashboard.settings.personal;

	return {
		editable
	};
};

export const functions: ConnectedFunctions = {
	onEditChunkData: editWidgetChunkData,
	onRemove: removeWidget,
	onSelect: selectWidget
};
