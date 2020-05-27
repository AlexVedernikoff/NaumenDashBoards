// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from '../attributes/constants';
import type {CurrentObjectState, ItemsMap, ReceiveNodesPayload, ReceiveRootsPayload} from './types';
import {NESTED_LEVEL_LIMIT} from './constants';

const getNodeId = ({code, sourceCode}: Attribute, parent?: string) => {
	let key = `${sourceCode}@${code}`;

	if (parent) {
		key = `${parent}.${key}`;
	}

	return key;
};

const getNodeNestedLevel = (items: ItemsMap, parent: string | null) => {
	let level = 0;
	let currentParent = parent;

	while (currentParent) {
		currentParent = items[currentParent].parent;
		level++;
	}

	return level;
};

const getTypes = (attribute: Attribute) => {
	const {backBOLinks, boLinks, object} = ATTRIBUTE_TYPES;
	const types = [
		backBOLinks,
		boLinks,
		object
	];

	if (!types.includes(attribute.type)) {
		types.push(attribute.type);
	}

	return types;
};

const createNode = (id: string, value: Object, parent: string | null, children: Array<string> | null) => ({
	children,
	error: false,
	id,
	loading: false,
	parent,
	uploaded: true,
	value
});

const receiveRoots = (state: CurrentObjectState, payload: ReceiveRootsPayload) => {
	const {attributes, type} = payload;
	let items = {};

	attributes.forEach(value => {
		const children = value.type in ATTRIBUTE_SETS.REF ? [] : null;
		const id = getNodeId(value);

		items[id] = createNode(id, value, null, children);
	});

	return {
		...state,
		[type]: {
			...state[type],
			items,
			loading: false
		}
	};
};

const receiveNodes = (state: CurrentObjectState, payload: ReceiveNodesPayload) => {
	const {attributes, parent, type} = payload;
	const isLast = getNodeNestedLevel(state[type].items, parent) === NESTED_LEVEL_LIMIT;
	const childrenIds = [];
	let items = {};

	attributes.forEach(value => {
		const id = getNodeId(value, parent);
		const children = isLast ? null : [];

		childrenIds.push(id);
		items[id] = createNode(id, value, parent, children);
	});

	return {
		...state,
		[type]: {
			...state[type],
			items: {
				...state[type].items,
				...items,
				[parent]: {
					...state[type].items[parent],
					loading: false,
					children: childrenIds
				}
			}
		}
	};
};

const request = (object: Object = {}) => ({
	...object,
	error: false,
	loading: true
});

const recordError = (object: Object) => ({
	...object,
	error: true,
	loading: false
});

export {
	getNodeId,
	getTypes,
	receiveNodes,
	receiveRoots,
	recordError,
	request
};
