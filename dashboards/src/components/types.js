// @flow
export type Ref<ElementType: React$ElementType> = {
	current: null | React$ElementRef<ElementType>
};

export type DivRef = Ref<'div'>;

export type InputRef = Ref<'input'>;

export type InputValue = string | number | boolean;

export type OnChangeInputEvent = {
	name: string,
	value: InputValue
};

export type SelectValue = any;

export type OnSelectEvent = {
	name: string,
	value: SelectValue
};

export type OnChangeEvent<V> = {
	name: string,
	value: V
};

export type TreeNode<V, R = {}> = {
	...R,
	children: Array<string> | null,
	error: boolean,
	id: string,
	loading: boolean,
	parent: string | null,
	uploaded: boolean,
	value: V
};

export type ValidateOptions = {
	abortEarly?: boolean,
	context?: Object,
	path?: string,
	recursive?: boolean,
	[string]: any
};

export type Schema = {
	validate(value: any, options?: ValidateOptions): Promise<void>;
};
