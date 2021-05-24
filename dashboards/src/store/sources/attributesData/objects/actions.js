// @flow
import {arrayToTree} from 'utils/arrayToTree';
import type {Attribute} from 'store/sources/attributes/types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
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
 * @param {boolean} includingArchival - сообщает нужно ли учитывать архивные объекты
 * @returns {ThunkAction}
 */
const searchObjects = (source: Source, attribute: Attribute, searchValue: string, includingArchival: boolean): ThunkAction =>
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
				removed: includingArchival,
				sourceCode: source.value,
				value: searchValue
			};
			const response = await window.jsApi.restCallModule('dashboards', 'searchValue', requestPayload);
			const items = arrayToTree(response, {
				keys: {
					children: 'children',
					value: 'uuid'
				},
				values: {
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
		includingArchival,
		offset = 0,
		parentUUID = null,
		source
	} = params;
	const {ACTUAL, ALL} = OBJECTS_DATA_TYPES;
	const id = getObjectKey(attribute, source);
	const payload = {
		id,
		parentUUID,
		type: includingArchival ? ALL : ACTUAL
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
			removed: includingArchival,
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
