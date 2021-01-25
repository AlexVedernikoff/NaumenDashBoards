// @flow
import type {TreeNode} from 'components/types';

export type NodeValue = Object;

export type Node = TreeNode<NodeValue>;

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

type GetValue<T> = (node: InputArrayNode, parent: string | null) => T;

type OptionValue<T> = GetValue<T> | T;

export type Values = {
	children: OptionValue<Array<string> | null>,
	id: GetValue<string>,
	uploaded: OptionValue<boolean>,
	value: GetValue<NodeValue>
};

export type Options = $Shape<{
	keys: Keys,
	parent: string | null,
	values: $Shape<Values>
}>;
