// @flow
import api from 'api';
import type {Attribute} from 'store/sources/attributes/types';
import {CURRENT_OBJECT_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getTypes} from './helpers';
import type {Item} from './types';

/**
 * Получает атрибуты относительно метакласса текущего объекта
 * @param {Attribute} attribute - атрибут относительно которого идет получение атрибутов текущего объекта
 * @returns {ThunkAction}
 */
const fetchRoots = (attribute: Attribute) => async (dispatch: Dispatch, getState: GetState) => {
	const {metaClass} = getState().context;
	const {type} = attribute;

	dispatch({
		payload: type,
		type: CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_ROOTS
	});

	try {
		const requestPayload = {
			classFqn: metaClass,
			types: getTypes(attribute)
		};
		const attributes = await api.instance.dashboards.getDataSourceAttributes(requestPayload);
		const payload = {
			attributes,
			type
		};

		dispatch({
			payload,
			type: CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_ROOTS
		});
	} catch (error) {
		dispatch({
			payload: type,
			type: CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_ROOTS_ERROR
		});
	}
};

/**
 * Получает атрибуты относительно атрибута текущего объекта
 * @param {Attribute} attribute - атрибут относительно которого идет получение атрибутов текущего объекта
 * @param {Item} node - родительский узел
 * @returns {ThunkAction}
 */
const fetchNodes = (attribute: Attribute, node: Item) => async (dispatch: Dispatch) => {
	const {id: parent, value} = node;
	const {type} = attribute;
	const payload = {
		parent,
		type
	};

	dispatch({
		payload,
		type: CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_NODES
	});

	try {
		const requestPayload = {
			attribute: value,
			deep: true,
			types: getTypes(attribute)
		};
		const attributes = await api.instance.dashboards.getAttributesFromLinkAttribute(requestPayload);

		dispatch({
			payload: {
				...payload,
				attributes
			},
			type: CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_NODES
		});
	} catch (error) {
		dispatch({
			payload,
			type: CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_NODES_ERROR
		});
	}
};

const fetchCurrentObjectAttributes = (parent: Item | null, attribute: Attribute): ThunkAction => (dispatch: Dispatch) => {
	parent === null ? dispatch(fetchRoots(attribute)) : dispatch(fetchNodes(attribute, parent));
};

export {
	fetchCurrentObjectAttributes
};
