// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedProps} from './types';
import {getAllWidgetsWithoutSelected} from 'store/widgets/data/selectors';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import {REGULAR_TABS, TABS} from 'src/containers/DiagramWidgetForm/constants';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const isPersonal = isPersonalDashboard(state);
	const user = state.context.user;
	const tabs = isPersonal && (user.role !== USER_ROLES.MASTER && user.role !== USER_ROLES.SUPER) ? REGULAR_TABS : TABS;

	return {
		saving: state.widgets.data.saving.loading,
		tabs,
		widgets: getAllWidgetsWithoutSelected(state)
	};
};

export const functions = {
	cancelForm
};
