// @flow
import type {AttributesDataAction, AttributesDataState} from './types';
import {ATTRIBUTES_DATA_EVENTS} from './constants';
import {defaultAttributesDataAction, initialAttributesDataState} from './init';
import {receiveData, recordError, requestData, setUploaded} from './helpers';

const reducer = (state: AttributesDataState = initialAttributesDataState, action: AttributesDataAction = defaultAttributesDataAction): AttributesDataState => {
	switch (action.type) {
		case ATTRIBUTES_DATA_EVENTS.RECEIVE_ACTUAL_VALUES:
			receiveData(state.actualValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECEIVE_ALL_VALUES:
			receiveData(state.allValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECEIVE_META_CLASSES:
			receiveData(state.metaClasses, action.payload, true);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECEIVE_STATES:
			receiveData(state.states, action.payload, true);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECORD_ACTUAL_VALUES_ERROR:
			recordError(state.actualValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECORD_ALL_VALUES_ERROR:
			recordError(state.allValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECORD_META_CLASSES_ERROR:
			recordError(state.metaClasses, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.RECORD_STATES_ERROR:
			recordError(state.states, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.REQUEST_ACTUAL_VALUES:
			requestData(state.actualValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.REQUEST_ALL_VALUES:
			requestData(state.allValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.REQUEST_META_CLASSES:
			requestData(state.metaClasses, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.REQUEST_STATES:
			requestData(state.states, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ACTUAL_VALUES:
			setUploaded(state.actualValues, action.payload);
			return {...state};
		case ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ALL_VALUES:
			setUploaded(state.allValues, action.payload);
			return {...state};
		default:
			return state;
	}
};

export default reducer;
