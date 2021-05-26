// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedProps} from './types';
import {getAllWidgetsWithoutSelected} from 'store/widgets/data/selectors';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';

export const props = (state: AppState): ConnectedProps => ({
	isPersonalDashboard: isPersonalDashboard(state),
	saving: state.widgets.data.saving.loading,
	widgets: getAllWidgetsWithoutSelected(state)
});

export const functions = {
	cancelForm
};
