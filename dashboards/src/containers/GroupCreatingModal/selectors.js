// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createCustomGroup, deleteCustomGroup, updateCustomGroup} from 'store/customGroups/actions';
import {fetchAttributesData} from 'store/sources/attributesData/actions';
import type {Widget} from 'store/widgets/data/types';

export const props = (state: AppState): ConnectedProps => {
	const {customGroups, sources, widgets: widgetsState} = state;
	const {map, selectedWidget} = widgetsState.data;
	// $FlowFixMe
	const widgets: Array<Widget> = Object.values(map).filter(widget => widget.id !== selectedWidget);

	return {
		attributesData: sources.attributesData,
		customGroups,
		widgets
	};
};

export const functions: ConnectedFunctions = {
	createCustomGroup,
	deleteCustomGroup,
	fetchAttributesData,
	updateCustomGroup
};
