// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {goToPoint, setActiveElement, setExportTo, setPosition, setScale} from 'store/entity/actions';
import type {State} from 'store/types';
/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement,
	centerPointUuid: state.entity.centerPointUuid,
	data: state.entity.data,
	exportTo: state.entity.exportTo,
	position: state.entity.position,
	scale: state.entity.scale,
	searchObjects: state.entity.searchObjects
});

export const functions: ConnectedFunctions = {
	goToPoint,
	setActiveElement,
	setExportTo,
	setPosition,
	setScale
};
