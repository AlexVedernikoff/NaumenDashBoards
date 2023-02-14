// @flow
export type Ref<ElementType: React$ElementType> = {
	current: null | React$ElementRef<ElementType>
};

export type OnSelectEvent<V> = {
	name: string,
	value: V
};

export type OnChangeEvent<V> = {
	name: string,
	value: V
};
