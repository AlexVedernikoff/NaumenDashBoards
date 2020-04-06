// @flow
import {defaultMetaClassesAction, initialMetaClassesState} from './init';
import type {MetaClassesAction, MetaClassesState} from './types';
import {META_CLASSES_EVENTS} from './constants';

const reducer = (state: MetaClassesState = initialMetaClassesState, action: MetaClassesAction = defaultMetaClassesAction): MetaClassesState => {
	switch (action.type) {
		case META_CLASSES_EVENTS.RECEIVE_META_CLASS_DATA:
			return {
				...state,
				[action.payload.metaClassFqn]: {
					...state[action.payload.metaClassFqn],
					items: action.payload.data,
					loading: false
				}
			};
		case META_CLASSES_EVENTS.RECORD_META_CLASS_DATA_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case META_CLASSES_EVENTS.REQUEST_META_CLASS_DATA:
			return {
				...state,
				[action.payload]: {
					items: [],
					error: false,
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
