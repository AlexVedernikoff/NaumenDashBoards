// @flow
import {DEFAULT_OPTIONS} from './constants';
import {extend} from 'src/helpers';
import type {InputArray, InputArrayNode, Options} from './types';

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
		const {keys} = this.options;
		const {[keys.children]: children} = arrayNode;
		const {id, uploaded, value} = this.getNodeValues(arrayNode, parent);

		const childrenIds = Array.isArray(children) && children.length > 0 ? this.addNodes(children, id) : null;

		this.tree[id] = {
			children: childrenIds,
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

	getId = (node: InputArrayNode, parent: string | null) => {
		const {[this.options.keys.id]: id} = node;
		return parent ? `${parent}$${id}` : id;
	};

	getNodeValues = (node: InputArrayNode, parent: string | null) => {
		const {values} = this.options;
		const nodeValues = {};

		Object.keys(values).forEach(key => {
			nodeValues[key] = typeof values[key] === 'function' ? values[key](node, parent) : values[key];
		});

		return nodeValues;
	};

	getTree = () => this.tree;

	getValue = (node: InputArrayNode) => {
		const {[this.options.keys.children]: children, ...value} = node;
		return value;
	};
}

export default Tree;
