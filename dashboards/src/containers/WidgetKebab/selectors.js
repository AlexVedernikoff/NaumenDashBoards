// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, OwnProps} from './types';
import {dataSelector, exportParamsSelector, filtersOnWidgetSelector, modeSelector, navigationSelector} from './helpers';
import {drillDown, openNavigationLink} from 'store/widgets/links/actions';
import {editWidgetChunkData, removeWidgetWithConfirm, saveWidgetWithNewFilters, selectWidget} from 'store/widgets/data/actions';
import {exportTableToXLSX} from 'store/widgets/buildData/actions';
import {isEditableDashboardContext, isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState, ownProps: OwnProps): ConnectedProps => {
	const {context, dashboard} = state;
	const {widget} = ownProps;
	const isEditableContext = isEditableDashboardContext(state);
	const isUserMode = isUserModeDashboard(state);
	const editable = context.user.role !== USER_ROLES.REGULAR || isEditableContext;
	const personalDashboard = dashboard.settings.personal;
	const navigation = navigationSelector(widget);
	const mode = (editable && !isUserMode && !personalDashboard) ? modeSelector(widget) : null;
	const exportParams = exportParamsSelector(widget);
	const data = dataSelector(widget);
	const filtersOnWidget = filtersOnWidgetSelector(widget);

	return {
		data,
		editable,
		exportParams,
		filtersOnWidget,
		mode,
		navigation,
		personalDashboard
	};
};

export const functions: ConnectedFunctions = {
	drillDown,
	editWidgetChunkData,
	exportTableToXLSX,
	openNavigationLink,
	removeWidgetWithConfirm,
	saveWidgetWithNewFilters,
	selectWidget
};
