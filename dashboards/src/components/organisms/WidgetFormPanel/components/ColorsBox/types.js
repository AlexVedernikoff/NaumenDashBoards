// @flow
type Colors = Array<string>;

export type Props = {
	data: Colors,
	name: string,
	onChange: (name: string, data: Colors) => void
};

export type State = {
	colorIndex: number,
	showPicker: boolean
};
