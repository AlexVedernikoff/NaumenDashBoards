// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {goToPoint, setActiveElement, setSearchObjects, setSearchText, showEditForm} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement,
	data: state.entity.data,
	searchObjects: state.entity.searchObjects,
	searchText: state.entity.searchText
});

export const functions: ConnectedFunctions = {
	goToPoint,
	setActiveElement,
	setSearchObjects,
	setSearchText,
	showEditForm
};
