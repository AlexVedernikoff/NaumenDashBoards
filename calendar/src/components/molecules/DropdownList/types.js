// @flow
export type SelectOption = {
	id: string,
	value: string
};

export type Props = {
	data: Array<SelectOption>,
	label: string,
	onChange?: (
		event: SyntheticInputEvent<HTMLOptionElement> & { value: SelectOption }
	) => void,
	value: SelectOption | null
};
