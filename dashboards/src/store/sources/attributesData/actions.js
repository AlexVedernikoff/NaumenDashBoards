// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {ATTRIBUTES_DATA_EVENTS, LIMIT} from './constants';
import {buildUrl, client} from 'utils/api';
import type {Data} from './types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';

/**
 * Получает только актульные значения, найденные по fqn метакласса атрибута
 * @param {string} property - fqn метакласса атрибута
 * @returns {ThunkAction}
 */
const fetchActualValues = (property: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestActualValues(property));
	const {actualValues} = getState().sources.attributesData;
	const offset = actualValues[property] ? actualValues[property].data.length : 0;

	try {
		const params = {
			count: LIMIT,
			offset,
			property,
			removed: false
		};
		const {data: attributes} = await client.post(buildUrl('dashboards', 'getAllAttributes', 'requestContent'), params);

		if (attributes.length > 0) {
			dispatch(receiveActualValues(attributes, property));
		}

		if (attributes.length < LIMIT) {
			dispatch(setUploadedActualValues(property));
		}
	} catch (error) {
		dispatch(recordActualValuesError(property));
	}
};

/**
 * Получает все значения (включая архивные), найденные по fqn метакласса атрибута
 * @param {string} property - fqn метакласса атрибута
 * @returns {ThunkAction}
 */
const fetchAllValues = (property: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestAllValues(property));
	const {allValues} = getState().sources.attributesData;
	const offset = allValues[property] ? allValues[property].data.length : 0;

	try {
		const params = {
			count: LIMIT,
			offset,
			property,
			removed: true
		};
		const {data: attributes} = await client.post(buildUrl('dashboards', 'getAllAttributes', 'requestContent'), params);

		if (attributes.length > 0) {
			dispatch(receiveAllValues(attributes, property));
		}

		if (attributes.length < LIMIT) {
			dispatch(setUploadedAllValues(property));
		}
	} catch (error) {
		dispatch(recordAllValuesError(property));
	}
};

/**
 * Получает значения, найденные по мета-классу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchMetaClasses = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestMetaClasses(metaClassFqn));

	try {
		const {data: metaClasses} = await client.post(buildUrl('dashboards', 'getMetaClasses', `'${metaClassFqn}'`));
		dispatch(receiveMetaClasses(metaClasses, metaClassFqn));
	} catch (error) {
		dispatch(recordMetaClassesError(metaClassFqn));
	}
};

/**
 * Получает статусы, найденные по метаклассу атрибута
 * @param {string} metaClassFqn - метакласс, в котором этот атрибут создан
 * @returns {ThunkAction}
 */
const fetchStates = (metaClassFqn: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestStates(metaClassFqn));

	try {
		const {data: states} = await client.post(buildUrl('dashboards', 'getStates', `'${metaClassFqn}'`));
		dispatch(receiveStates(states, metaClassFqn));
	} catch (error) {
		dispatch(recordStatesError(metaClassFqn));
	}
};

/**
 * Вызывает необходимый метод получения данных взависимости от данных атрибута
 * @param {Attribute} attribute - атрибут
 * @param {boolean} actual - параметр указаывает о необходимости включать архивные значения в ответ
 * @returns {ThunkAction}
 */
const fetchAttributesData = (attribute: Attribute, actual: boolean = true): ThunkAction => (dispatch: Dispatch) => {
	const {metaClassFqn, property, type} = attribute;
	const {metaClass, state} = ATTRIBUTE_TYPES;

	if (property) {
		actual ? dispatch(fetchActualValues(property)) : dispatch(fetchAllValues(property));
	}

	if (type === state) {
		dispatch(fetchStates(metaClassFqn));
	}

	if (type === metaClass) {
		dispatch(fetchMetaClasses(metaClassFqn));
	}
};

const requestActualValues = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.REQUEST_ACTUAL_VALUES,
	payload
});

const requestAllValues = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.REQUEST_ALL_VALUES,
	payload
});

const requestStates = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.REQUEST_STATES,
	payload
});

const requestMetaClasses = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.REQUEST_META_CLASSES,
	payload
});

const recordActualValuesError = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECORD_ACTUAL_VALUES_ERROR,
	payload
});

const recordAllValuesError = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECORD_ALL_VALUES_ERROR,
	payload
});

const recordMetaClassesError = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECORD_META_CLASSES_ERROR,
	payload
});

const recordStatesError = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECORD_STATES_ERROR,
	payload
});

const receiveActualValues = (data: Array<Data>, key: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECEIVE_ACTUAL_VALUES,
	payload: {data, key}
});

const receiveAllValues = (data: Array<Data>, key: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECEIVE_ALL_VALUES,
	payload: {data, key}
});

const receiveMetaClasses = (data: Array<Data>, key: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECEIVE_META_CLASSES,
	payload: {data, key}
});

const receiveStates = (data: Array<Data>, key: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.RECEIVE_STATES,
	payload: {data, key}
});

const setUploadedActualValues = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ACTUAL_VALUES,
	payload
});

const setUploadedAllValues = (payload: string) => ({
	type: ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ALL_VALUES,
	payload
});

export {
	fetchAttributesData
};
