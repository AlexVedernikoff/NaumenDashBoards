// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedProps} from './types';
import {fetchAttributes, setLoadingStateAttributes} from 'store/sources/attributes/actions';
import {getAllWidgetsWithoutSelected} from 'store/widgets/data/selectors';
import {isPersonalDashboard, isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {REGULAR_TABS, TABS} from 'src/containers/DiagramWidgetForm/constants';
import {translateObjectsArray} from 'localization';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const isPersonal = isPersonalDashboard(state);
	const isUserMode = isUserModeDashboard(state);
	const user = state.context.user;
	const tabs = isUserMode || (isPersonal && (user.role !== USER_ROLES.MASTER && user.role !== USER_ROLES.SUPER))
		? translateObjectsArray('title', REGULAR_TABS)
		: translateObjectsArray('title', TABS);

	return {
		attributes: state.sources.attributes,
		saving: state.widgets.data.saving.loading,
		tabs,
		widgets: getAllWidgetsWithoutSelected(state)
	};
};

export const functions = {
	cancelForm,
	fetchAttributes,
	setLoadingStateAttributes
};
