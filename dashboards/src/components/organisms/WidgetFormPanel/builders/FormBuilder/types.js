// @flow
export type TextAreaProps = {
	handleBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	label: string,
	name: string,
	placeholder?: string,
	value: string
};

export type CheckboxProps = {
	hideDivider?: boolean,
	label: string,
	name: string,
	onClick?: () => void,
	value: boolean
};

export type LabelProps = {
	icon?: string,
	name: string,
	onClick?: () => void
};
