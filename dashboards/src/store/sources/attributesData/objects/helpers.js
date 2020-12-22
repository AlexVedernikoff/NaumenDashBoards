// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ObjectsMap, ObjectsState, Payload, RawObjectData, ReceivePayload} from './types';
import type {Source} from 'store/widgets/data/types';

const getObjectsMap = (state: ObjectsState, actual: boolean): ObjectsMap => actual ? state.actual : state.all;

const request = (object: Object) => ({
	...object,
	error: false,
	loading: true
});

const createObjectData = () => ({
	error: false,
	items: {},
	loading: true,
	uploaded: false
});

const requestObjectData = (map: ObjectsMap, payload: Payload) => {
	const {id, parentUUID} = payload;

	if (!map[id]) {
		return createObjectData();
	} else if (parentUUID) {
		return {
			...map[id],
			items: {
				...map[id].items,
				[parentUUID]: request(map[id].items[parentUUID])
			}
		};
	}

	return request(map[id]);
};

const createObjectDataItem = (data: RawObjectData, root: boolean) => {
	const {children, title, uuid} = data;

	return {
		children: children > 0 ? [] : null,
		error: false,
		id: uuid,
		loading: false,
		root,
		uploaded: false,
		value: {
			title,
			uuid
		}
	};
};

const receiveObjectData = (map: ObjectsMap, payload: ReceivePayload) => {
	const {data, id, parentUUID, uploaded} = payload;
	const items = {};

	data.forEach(item => {
		items[item.uuid] = createObjectDataItem(item, !parentUUID);
	});

	if (parentUUID) {
		const children = map[id].items[parentUUID].children || [];

		return {
			...map[id],
			items: {
				...map[id].items,
				[parentUUID]: {
					...map[id].items[parentUUID],
					children: [...children, ...data.map(item => item.uuid)],
					loading: false,
					uploaded
				},
				...items
			}
		};
	}

	return {
		...map[id],
		items: {
			...map[id].items,
			...items
		},
		loading: false,
		uploaded
	};
};

const recordError = (object: Object) => ({
	...object,
	error: true,
	loading: false
});

const recordObjectError = (map: ObjectsMap, payload: Payload) => {
	const {id, parentUUID} = payload;

	if (parentUUID) {
		return {
			...map[id],
			items: {
				...map[id].items,
				[parentUUID]: recordError(map[id].items[parentUUID])
			}
		};
	}

	return recordError(map[id]);
};

/**
 * Возвращает уникальный ключ атрибута относительно выбранного источника
 * @param {Attribute} attribute - атрибут
 * @param {Source} source - источник атрибута
 * @returns {string}
 */
const getObjectKey = (attribute: Attribute, source: Source): string => {
	const {code, property} = attribute;
	return `${source.value}_${property}${code}`;
};

export {
	createObjectData,
	getObjectKey,
	getObjectsMap,
	receiveObjectData,
	recordObjectError,
	requestObjectData
};
