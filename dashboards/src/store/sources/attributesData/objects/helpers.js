// @flow
import type {ObjectsMap, ObjectsState, Payload, RawObjectData, ReceivePayload} from './types';

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
	const {parentUUID, property} = payload;

	if (!map[property]) {
		return createObjectData();
	} else if (parentUUID) {
		return {
			...map[property],
			items: {
				...map[property].items,
				[parentUUID]: request(map[property].items[parentUUID])
			}
		};
	}

	return request(map[property]);
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
	const {data, parentUUID, property, uploaded} = payload;
	const items = {};

	data.forEach(item => {
		items[item.uuid] = createObjectDataItem(item, !parentUUID);
	});

	if (parentUUID) {
		return {
			...map[property],
			items: {
				...map[property].items,
				[parentUUID]: {
					...map[property].items[parentUUID],
					children: data.map(item => item.uuid),
					loading: false,
					uploaded
				},
				...items
			}
		};
	}

	return {
		...map[property],
		items: {
			...map[property].items,
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
	const {parentUUID, property} = payload;

	if (parentUUID) {
		return {
			...map[property],
			items: {
				...map[property].items,
				[parentUUID]: recordError(map[property].items[parentUUID])
			}
		};
	}

	return recordError(map[property]);
};

export {
	receiveObjectData,
	recordObjectError,
	getObjectsMap,
	requestObjectData
};
