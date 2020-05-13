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

export type OnChangeLabelEvent = {
	label: string,
	name: string
};
