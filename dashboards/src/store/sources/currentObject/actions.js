// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {buildUrl, client} from 'utils/api';
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
		type: CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_ROOTS,
		payload: type
	});

	try {
		const url = buildUrl('dashboards', 'getDataSourceAttributes', 'requestContent');
		const data = {
			classFqn: metaClass,
			types: getTypes(attribute)
		};
		let {data: attributes} = await client.post(url, data);
		const payload = {
			attributes,
			type
		};

		dispatch({
			type: CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_ROOTS,
			payload
		});
	} catch (error) {
		dispatch({
			type: CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_ROOTS_ERROR,
			payload: type
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
		type: CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_NODES,
		payload
	});

	try {
		const url = buildUrl('dashboards', 'getAttributesFromLinkAttribute', 'requestContent');
		const data = {
			attribute: value,
			deep: true,
			types: getTypes(attribute)
		};
		const {data: attributes} = await client.post(url, data);

		dispatch({
			type: CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_NODES,
			payload: {
				...payload,
				attributes
			}
		});
	} catch (error) {
		dispatch({
			type: CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_NODES_ERROR,
			payload
		});
	}
};

const fetchCurrentObjectAttributes = (parent: Item | null, attribute: Attribute): ThunkAction => (dispatch: Dispatch) => {
	parent === null ? dispatch(fetchRoots(attribute)) : dispatch(fetchNodes(attribute, parent));
};

export {
	fetchCurrentObjectAttributes
};
