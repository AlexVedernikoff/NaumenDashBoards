// @flow
import {changeEditingGlobal, setDefaultViewData} from 'store/entity/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	dataDefaultView: state.entity.dataDefaultView,
	editingGlobal: state.entity.editingGlobal,
	personalViewData: state.entity.listViews.personalView.viewData
});

export const functions: ConnectedFunctions = {
	changeEditingGlobal,
	setDefaultViewData
};
