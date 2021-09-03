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
				id: this.getId,
				loading: false,
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
		const {id, loading, uploaded, value} = this.getNodeValues(arrayNode, parent);
		const {hasChildren, [this.options.keys.children]: arrayChildren} = arrayNode;
		let children = null;

		if ((Array.isArray(arrayChildren) && arrayChildren.length > 0) || hasChildren) {
			children = this.addNodes(arrayChildren, id);
		}

		if (this.tree[id]) {
			children = children ? [...this.tree[id].children, ...children] : this.tree[id].children;
		}

		this.tree[id] = {
			children,
			id,
			loading,
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

	getId = (node: InputArrayNode, parent: string): string => {
		const {[this.options.keys.value]: value} = node;

		return parent ? `${parent}$${value}` : value;
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
		const {hasChildren, [this.options.keys.children]: children, ...value} = node;

		return value;
	};
}

export default Tree;
