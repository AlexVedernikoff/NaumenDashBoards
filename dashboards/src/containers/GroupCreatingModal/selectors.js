// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createCustomGroup, deleteCustomGroup, updateCustomGroup} from 'store/customGroups/actions';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import {getMapValues} from 'helpers';

export const props = (state: AppState): ConnectedProps => {
	const {customGroups, widgets: widgetsState} = state;
	const {map, selectedWidget} = widgetsState.data;
	const widgets = getMapValues(map).filter(widget => {
		const {id, type} = widget;

		return id !== selectedWidget && type in DIAGRAM_WIDGET_TYPES;
	});

	return {
		editableCustomGroups: customGroups.editable,
		originalCustomGroups: customGroups.original,
		widgets
	};
};

export const functions: ConnectedFunctions = {
	createCustomGroup,
	deleteCustomGroup,
	updateCustomGroup
};
