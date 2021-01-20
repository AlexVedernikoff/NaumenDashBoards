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

type GetValue<T> = (node: InputArrayNode, parent: string | null) => T;

type OptionValue<T> = GetValue<T> | T;

type Values = $Shape<{
	id: OptionValue<string>,
	uploaded: OptionValue<boolean>,
	value: OptionValue<Object>
}>;

export type Options = $Shape<{
	keys: Keys,
	parent: string | null,
	values: Values
}>;
