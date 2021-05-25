// @flow
export type Presentation = 'full_length' | 'right_of_label' | 'under_label';

export type Option = {
	label?: string,
	presentation: Presentation,
	value: string
};
