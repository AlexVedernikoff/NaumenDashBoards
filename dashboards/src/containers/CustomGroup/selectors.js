// @flow
import type {AppState} from 'store/types';
import {
	clearUnnamedCustomGroup,
	createCustomGroup,
	deleteCustomGroup,
	fetchCustomGroup,
	fetchCustomGroups,
	updateCustomGroup
} from 'store/customGroups/actions';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import {getMapValues} from 'helpers';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {customGroups, widgets: widgetsState} = state;
	const {map, selectedWidget} = widgetsState.data;
	const {loading, map: customGroupsMap} = customGroups;
	const widgets = getMapValues(map).filter(widget => {
		const {id, type} = widget;
		return id !== selectedWidget && type in DIAGRAM_WIDGET_TYPES;
	});
	const group = customGroupsMap[props.value];

	return {
		group: group?.data,
		loading: group?.loading,
		loadingOptions: loading,
		widgets
	};
};

export const functions: ConnectedFunctions = {
	onClearUnnamed: clearUnnamedCustomGroup,
	onCreate: createCustomGroup,
	onFetch: fetchCustomGroup,
	onFetchOptions: fetchCustomGroups,
	onRemove: deleteCustomGroup,
	onUpdate: updateCustomGroup
};
