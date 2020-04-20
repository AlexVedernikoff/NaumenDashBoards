// @flow

export type DivRef = {
	current: null | HTMLDivElement
};

export type FormRef = {
	current: null | HTMLFormElement
};

export type InputRef = {
	current: null | HTMLInputElement
};

export type InputValue = string | number | boolean;

export type OnChangeInputEvent = {
	name: string,
	value: InputValue
};

export type SelectValue = string | null | Object;

export type OnSelectEvent = {
	name: string,
	value: SelectValue
};
