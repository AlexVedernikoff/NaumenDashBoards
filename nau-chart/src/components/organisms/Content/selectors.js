// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {goToPoint, saveEntitiesLocationSettings, setActiveElement, setExportTo, setPosition, setScale} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement,
	centerPointUuid: state.entity.centerPointUuid,
	data: state.entity.data,
	editingGlobal: state.entity.editingGlobal,
	exportTo: state.entity.exportTo,
	openContextMenu: (e: any) => {},
	position: state.entity.position,
	scale: state.entity.scale,
	searchObjects: state.entity.searchObjects
});

export const functions: ConnectedFunctions = {
	goToPoint,
	saveEntitiesLocationSettings,
	setActiveElement,
	setExportTo,
	setPosition,
	setScale
};
