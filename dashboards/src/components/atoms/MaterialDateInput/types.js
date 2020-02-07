// @flow
export type Props = {
	name: string,
	onChange: (name: string, date: string) => void,
	value: string
};

export type State = {
	showDatepicker: boolean
};
