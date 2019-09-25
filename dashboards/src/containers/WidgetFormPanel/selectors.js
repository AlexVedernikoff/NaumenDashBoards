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
		isLoadingAttr: state.sources.attributes.loading,
		selectedWidget: selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget]
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	createWidget,
	fetchAttributes,
	saveWidget
};
