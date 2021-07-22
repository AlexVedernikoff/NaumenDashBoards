// @flow
import {arrayToTree} from './index';

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

const getTree = (levels = 1, limit = 5) => {
	const arrayTree = generateArrayTree(levels, limit);
	return arrayToTree(arrayTree);
};

export {
	getTree
};
