import {arrayToTree} from 'utils/arrayToTree';
import {DEFAULT_COMPONENTS} from 'components/molecules/TreeSelect/constants';

/**
 * Возвращает дерево значений в виде массива
 * @param levels - количество уровней дерева
 * @param limit - лимит элементов на уровне
 */
const generateArrayTree = (levels = 2, limit = 5) => {
	const createNode = (index, level) => ({
		children: level <= levels ? createNodes(level) : null,
		label: `node${index}`,
		value: `node${index}`
	});

	const createNodes = (level = 1) => {
		const nextLevel = level + 1;

		return Array.from(Array(limit)).map((v, i) => createNode(i, nextLevel));
	};

	return createNodes();
};

/**
 * Возвращает дерево значений в виде мапы
 * @param levels - количество уровней дерева
 * @param limit - лимит элементов на уровне
 */
const getTree = (levels = 1, limit = 5) => {
	const arrayTree = generateArrayTree(levels, limit);

	return arrayToTree(arrayTree);
};

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = mixin => ({
	components: DEFAULT_COMPONENTS,
	getNodeLabel: node => node.value?.label,
	getNodeValue: node => node.value?.value,
	getOptionLabel: option => option?.label,
	getOptionValue: option => option?.value,
	isDisabled: () => false,
	loading: false,
	multiple: false,
	onSelect: () => undefined,
	options: {},
	searchValue: '',
	showMore: false,
	value: null,
	values: [],
	...mixin
});

export {
	getTree,
	getProps
};
