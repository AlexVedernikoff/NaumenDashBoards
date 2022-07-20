// @flow
import {defaultLinkedAttributesAction, initialLinkedAttributesState} from './init';
import type {LinkedAttributesState, LinkedDataSourcesAction} from './types';

const reducer = (
	state: LinkedAttributesState = initialLinkedAttributesState,
	action: LinkedDataSourcesAction = defaultLinkedAttributesAction
): LinkedAttributesState => {
	switch (action.type) {
		case 'REQUEST_LINKED_ATTRIBUTES':
			return {
				...state,
				[action.payload.key]: {
					error: false,
					loading: true,
					options: []
				}
			};
		case 'RECEIVE_LINKED_ATTRIBUTES':
			return {
				...state,
				[action.payload.key]: {
					error: false,
					loading: false,
					options: action.payload.attributes
				}
			};
		case 'REQUEST_LINKED_ATTRIBUTES_ERROR':
			return {
				...state,
				[action.payload.key]: {
					error: true,
					loading: false,
					options: []
				}
			};
		default:
			return state;
	}
};

export default reducer;
