// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {getSelectedWidget} from 'store/widgets/data/selectors';
import {resetForm, setWidgetValues} from 'store/widgetForms/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	widget: getSelectedWidget(state)
});

export const functions: ConnectedFunctions = {
	cancelForm,
	createToast,
	resetForm,
	setWidgetValues
};
