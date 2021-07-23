// @flow
import type {MetaClassesAction, MetaClassesState} from './types';
import {META_CLASSES_EVENTS} from './constants';

export const initialMetaClassesState: MetaClassesState = {};

export const defaultMetaClassesAction: MetaClassesAction = {
	type: META_CLASSES_EVENTS.UNKNOWN_META_CLASSES_ACTION
};
