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
		this.options = extend(this.options, options);
	}

	/**
	 * Добавляет в дерево узел со всеми дочерними элементами
	 * @param {InputArrayNode} arrayNode - исходный узел
	 * @param {string | null} parent - идентификатор родителя
	 * @returns {string} - ключ добавленного узла
	 */
	addNode = (arrayNode: InputArrayNode, parent: string | null): string => {
		const {keys} = this.options;
		const {[keys.children]: children, ...value} = arrayNode;
		let {[keys.id]: id} = value;

		if (parent) {
			id = `${parent}$${id}`;
		}

		const childrenIds = Array.isArray(children) && children.length > 0 ? this.addNodes(children, id) : null;

		this.tree[id] = {
			children: childrenIds,
			id,
			loading: false,
			parent,
			uploaded: true,
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

	createTree = () => this.addNodes(this.array);

	getId = (id: string, parent: string | null) => parent ? `${parent}$${id}` : id;

	getTree = () => this.tree;
}

export default Tree;
