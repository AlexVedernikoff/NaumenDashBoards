// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getSelectedWidgetId} from 'store/widgets/data/selectors';
import {setHideEditPanel} from 'store/dashboard/settings/actions';

export const props = (state: AppState): ConnectedProps => {
	return {
		selectedWidget: getSelectedWidgetId(state),
		swiped: state.dashboard.settings.hideEditPanel
	};
};

export const functions: ConnectedFunctions = {
	updateSwiped: setHideEditPanel
};
