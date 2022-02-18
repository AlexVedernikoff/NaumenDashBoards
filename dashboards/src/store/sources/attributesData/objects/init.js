// @flow
import type {ObjectsAction, ObjectsState} from './types';

export const initialObjectsState: ObjectsState = {
	actual: {},
	all: {},
	found: {}
};

export const defaultObjectsAction: ObjectsAction = {type: 'UNKNOWN_OBJECTS_ACTION'};
