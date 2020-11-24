// @flow
import type {CatalogItemTree, RawCatalogItem} from './types';

/**
 * Возвращает дерево с добавленным узлом и всеми его вложенными дочерними элементами
 * @param {RawCatalogItem} value - элемент каталога
 * @param {string | null} parent - идентификатор родителя
 * @param {CatalogItemTree} tree - дерево элементов
 * @returns {CatalogItemTree}
 */
const addNode = (value: RawCatalogItem, parent: string | null, tree: CatalogItemTree): CatalogItemTree => {
	const {children, uuid: id} = value;

	return {
		...tree,
		...getTree(children, id, tree),
		[id]: {
			children: children.length > 0 ? children.map(item => item.uuid) : null,
			id,
			loading: false,
			parent,
			uploaded: true,
			value
		}
	};
};

/**
 * Возвращает дерево элементов с учетом вложенности, построенное по полученному массиву данных
 * @param {Array<RawCatalogItem>} catalogItems - массив данных элементов каталога
 * @param {string | null} parent - идентификатор родителя
 * @param {CatalogItemTree} tree - дерево элементов
 * @returns {CatalogItemTree}
 */
const getTree = (
	catalogItems: Array<RawCatalogItem>,
	parent: string | null = null,
	tree: CatalogItemTree = {}
): CatalogItemTree => {
	let newTree = tree;

	catalogItems.forEach(item => {
		newTree = addNode(item, parent, newTree);
	});

	return newTree;
};

export {
	getTree
};
