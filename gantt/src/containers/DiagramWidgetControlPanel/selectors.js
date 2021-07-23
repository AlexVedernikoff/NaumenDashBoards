// @flow
import type {ConnectedFunctions} from './types';
import {drillDown, openNavigationLink} from 'store/widgets/links/actions';
import {saveWidgetWithNewFilters} from 'store/widgets/data/actions';

export const functions: ConnectedFunctions = {
	onDrillDown: drillDown,
	onNavigation: openNavigationLink,
	// $FlowFixMe[incompatible-type]
	onSaveWidgetWithNewFilters: saveWidgetWithNewFilters
};
