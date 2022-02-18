// @flow
import {defaultMetaClassesAction, initialMetaClassesState} from './init';
import type {MetaClassesAction, MetaClassesState} from './types';

const reducer = (state: MetaClassesState = initialMetaClassesState, action: MetaClassesAction = defaultMetaClassesAction): MetaClassesState => {
	switch (action.type) {
		case 'RECEIVE_META_CLASS_DATA':
			return {
				...state,
				[action.payload.metaClassFqn]: {
					...state[action.payload.metaClassFqn],
					items: action.payload.data,
					loading: false
				}
			};
		case 'RECORD_META_CLASS_DATA_ERROR':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case 'REQUEST_META_CLASS_DATA':
			return {
				...state,
				[action.payload]: {
					error: false,
					items: [],
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
