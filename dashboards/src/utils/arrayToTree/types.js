// @flow
import type {TreeNode} from 'components/types';

export type Value = Object;

export type Node = TreeNode<Value>;

export type Tree = {
	[key: string]: Node
};

export type InputArrayValue = Object;

export type InputArrayNode = {
	children: Array<InputArrayNode>,
	...InputArrayValue
};

export type InputArray = Array<InputArrayNode>;

type Keys = $Shape<{
	children: string,
	id: string
}>;

export type Options = $Shape<{
	keys: Keys
}>;
