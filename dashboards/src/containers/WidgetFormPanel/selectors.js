// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {NewWidget} from 'entities';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {data} = state.widgets;
	const {newWidget, selectedWidget} = data;

	return {
		attributes: state.sources.attributes.map,
		saveError: data.saveError,
		saveLoading: data.saveLoading,
		selectedWidget: selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget],
		sources: state.sources.data.map
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	createWidget,
	fetchAttributes,
	saveWidget
};
