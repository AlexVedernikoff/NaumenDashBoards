// @flow
import type {InputArray, Options, Tree as TreeType} from './types';
import Tree from './Tree';

const arrayToTree = (array: InputArray, options: Options): TreeType => {
	const tree = new Tree(array, options);

	tree.createTree();

	return tree.getTree();
};

export default arrayToTree;
