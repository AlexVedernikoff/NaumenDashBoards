// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {NewWidget} from 'utils/widget';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {data} = state.widgets;
	const {newWidget, selectedWidget} = data;

	return {
		attributes: state.sources.attributes.map,
		context: state.dashboard.context,
		role: state.dashboard.role,
		saveError: data.saveError,
		selectedWidget: selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget],
		sources: state.sources.data.map,
		updating: data.updating
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	createWidget,
	fetchAttributes,
	saveWidget
};
