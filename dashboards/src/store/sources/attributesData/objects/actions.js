// @flow
import {arrayToTree} from 'utils/arrayToTree';
import type {Attribute} from 'store/sources/attributes/types';
import type {Dispatch, ThunkAction} from 'store/types';
import type {FetchParams, RawObjectData} from './types';
import {getObjectKey} from './helpers';
import {LIMIT, OBJECTS_DATA_TYPES, OBJECTS_EVENTS} from './constants';
import type {Source} from 'store/widgets/data/types';

/**
 * Сообщает загружены ли дочерние элементы узла полностью
 * @param {RawObjectData} node - узел данных
 * @returns {boolean}
 */
const isUploaded = (node: RawObjectData): boolean => {
	const {children, hasChildren} = node;
	return (Array.isArray(children) && children.length > 0) || !hasChildren;
};

/**
 * Возвращает ключи дочерних элементов
 * @param {RawObjectData} node - узел данных
 * @returns {Array<string>}
 */
const getChildren = (node: RawObjectData): Array<string> => {
	const {children, hasChildren} = node;
	let ids = null;

	if (Array.isArray(children) && children.length > 0) {
		ids = children.map(getId);
	} else if (hasChildren) {
		ids = [];
	}

	return ids;
};

/**
 * Возвращает уникальный идентификатор узла
 * @param {RawObjectData} node - узел данных
 * @returns {string}
 */
const getId = (node: RawObjectData): string => node.uuid;

/**
 * Осуществляет поиск объектов по названию
 * @param {Source} source - источник относительно которого нужно производить поиск
 * @param {Attribute} attribute - атрибут источника
 * @param {string} searchValue - название
 * @returns {ThunkAction}
 */
const searchObjects = (source: Source, attribute: Attribute, searchValue: string): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState) => {
		const id = getObjectKey(attribute, source);
		const {id: foundData} = getState().sources.attributesData.objects.found;

	dispatch({
		payload: {
			id,
			searchValue
		},
		type: OBJECTS_EVENTS.FOUND_OBJECTS_PENDING
	});

	try {
		if (searchValue) {
			const requestPayload = {
				attribute,
				sourceCode: source.value,
				value: searchValue
			};
			const response = await window.jsApi.restCallModule('dashboards', 'searchValue', requestPayload);
			const items = arrayToTree(response, {
				keys: {
					children: 'children',
					id: 'uuid'
				},
				values: {
					children: getChildren,
					id: getId,
					uploaded: isUploaded
				}
			});

			dispatch({
				payload: {
					id,
					items
				},
				type: OBJECTS_EVENTS.FOUND_OBJECTS_FULFILLED
			});
		} else if (foundData && foundData.searchValue) {
			dispatch({
				payload: {
					id,
					searchValue
				},
				type: OBJECTS_EVENTS.CHANGE_SEARCH_VALUE
			});
		}
	} catch (error) {
		dispatch({
			payload: id,
			type: OBJECTS_EVENTS.FOUND_OBJECT_REJECTED
		});
	}
};

/**
 * Получает список объектов атрибута
 * @param {FetchParams} params - параметры для запрос
 * @returns {ThunkAction}
 */
const fetchObjectData = (params: FetchParams): ThunkAction => async (dispatch: Dispatch) => {
	const {
		attribute,
		offset = 0,
		parentUUID = null,
		source,
		type
	} = params;
	const id = getObjectKey(attribute, source);
	const payload = {
		id,
		parentUUID,
		type
	};

	dispatch({
		payload,
		type: OBJECTS_EVENTS.OBJECT_DATA_PENDING
	});

	try {
		const requestPayload = {
			attribute,
			count: LIMIT,
			offset,
			parentUUID,
			removed: type === OBJECTS_DATA_TYPES.ALL,
			sourceCode: source.value
		};
		const data = await window.jsApi.restCallModule('dashboards', 'getAttributeObject', requestPayload);
		const uploaded = data.length < LIMIT;

		dispatch({
			payload: {...payload, data, uploaded},
			type: OBJECTS_EVENTS.OBJECT_DATA_FULFILLED
		});
	} catch (error) {
		dispatch({
			payload,
			type: OBJECTS_EVENTS.OBJECT_DATA_REJECTED
		});
	}
};

export {
	fetchObjectData,
	searchObjects
};
