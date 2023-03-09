// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {getFullSelectedWidget} from 'store/widgets/data/selectors';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {resetForm, setWidgetUserMode, setWidgetValues} from 'store/widgetForms/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	isUserMode: isUserModeDashboard(state),
	widget: getFullSelectedWidget(state)
});

export const functions: ConnectedFunctions = {
	cancelForm,
	createToast,
	resetForm,
	setWidgetUserMode,
	setWidgetValues
};
