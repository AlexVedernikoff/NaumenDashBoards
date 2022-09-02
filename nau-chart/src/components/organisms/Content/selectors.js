// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setActiveElement, setExportTo, setPosition} from 'store/entity/actions';
import type {State} from 'store/types';
/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	data: state.entity.data,
	exportTo: state.entity.exportTo,
	position: state.entity.position,
	scale: state.entity.scale
});

export const functions: ConnectedFunctions = {
	setActiveElement,
	setExportTo,
	setPosition
};
