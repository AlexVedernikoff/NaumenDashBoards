// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getDataEntity, setExportTo, setScale} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	data: state.entity.data,
	scale: state.entity.scale
});

export const functions: ConnectedFunctions = {
	getDataEntity,
	setExportTo,
	setScale
};
