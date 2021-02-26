// @flow
import {DEFAULT_OPTIONS} from './constants';
import {extend} from 'helpers';
import type {InputArray, InputArrayNode, NodeValue, Options, Tree as TreeMap} from './types';

class Tree {
	array = [];
	options = DEFAULT_OPTIONS;
	tree = {};

	constructor (array: InputArray, options: Options) {
		this.array = array;
		this.options = extend({
			...this.options,
			values: {
				children: this.getChildren,
				id: this.getId,
				uploaded: true,
				value: this.getValue
			}
		}, options);
	}

	/**
	 * Добавляет в дерево узел со всеми дочерними элементами
	 * @param {InputArrayNode} arrayNode - исходный узел
	 * @param {string | null} parent - идентификатор родителя
	 * @returns {string} - ключ добавленного узла
	 */
	addNode = (arrayNode: InputArrayNode, parent: string | null): string => {
		const {children, id, uploaded, value} = this.getNodeValues(arrayNode, parent);

		if (Array.isArray(children) && children.length > 0) {
			this.addNodes(arrayNode.children, id);
		}

		this.tree[id] = {
			children,
			id,
			loading: false,
			parent,
			uploaded,
			value
		};

		return id;
	};

	/**
	 * Добавляет узлы в дерево
	 * @param {InputArray} array - массив исходных узлов
	 * @param {string | null} parent - идентификатор родителя
	 * @returns {Array<string>} - массив ключей добавленных узлов
	 */
	addNodes = (array: InputArray, parent: string | null = null): Array<string> => {
		const ids = [];

		array.forEach(item => {
			ids.push(this.addNode(item, parent));
		});

		return ids;
	};

	createTree = () => this.addNodes(this.array, this.options.parent);

	getChildren = (node: InputArrayNode, parent: string | null): Array<string> | null => {
		const {keys, values} = this.options;
		const {[keys.children]: children} = node;
		let ids = null;

		if (Array.isArray(children) && children.length > 0) {
			ids = children.map(child => values.id ? values.id(child, parent) : this.getId(child));
		}

		return ids;
	};

	getId = (node: InputArrayNode): string => {
		const {[this.options.keys.id]: id} = node;

		return id;
	};

	getNodeValues = (node: InputArrayNode, parent: string | null) => {
		const {values} = this.options;
		const nodeValues = {};

		Object.keys(values).forEach(key => {
			nodeValues[key] = typeof values[key] === 'function' ? values[key](node, parent) : values[key];
		});

		return nodeValues;
	};

	getTree = (): TreeMap => this.tree;

	getValue = (node: InputArrayNode): NodeValue => {
		const {[this.options.keys.children]: children, ...value} = node;

		return value;
	};
}

export default Tree;
