// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {getSelectedWidgetId} from 'store/widgets/data/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {editMode} = state.dashboard.settings;

	return {
		editMode,
		selectedWidget: getSelectedWidgetId(state)
	};
};
