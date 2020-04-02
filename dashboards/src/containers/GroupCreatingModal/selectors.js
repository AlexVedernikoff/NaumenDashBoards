// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createCustomGroup, deleteCustomGroup, updateCustomGroup} from 'store/customGroups/actions';
import {getMapValues} from 'src/helpers';

export const props = (state: AppState): ConnectedProps => {
	const {customGroups, widgets: widgetsState} = state;
	const {map, selectedWidget} = widgetsState.data;
	const widgets = getMapValues(map).filter(widget => widget.id !== selectedWidget);

	return {
		customGroups: getMapValues(customGroups),
		widgets
	};
};

export const functions: ConnectedFunctions = {
	createCustomGroup,
	deleteCustomGroup,
	updateCustomGroup
};
