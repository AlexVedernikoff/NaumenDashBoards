// @flow
import type {ObjectsAction, ObjectsState} from './types';
import {OBJECTS_EVENTS} from './constants';

export const initialObjectsState: ObjectsState = {
	actual: {},
	all: {}
};

export const defaultObjectsAction: ObjectsAction = {
	type: OBJECTS_EVENTS.UNKNOWN_OBJECTS_ACTION
};
