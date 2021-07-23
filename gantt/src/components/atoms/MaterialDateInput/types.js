// @flow
export type Props = {
	availableFormats: Array<string>,
	name: string,
	onChange: (name: string, date: string) => void,
	onSelect: (name: string, date: string) => void,
	value: string
};

export type State = {
	showDatepicker: boolean
};
