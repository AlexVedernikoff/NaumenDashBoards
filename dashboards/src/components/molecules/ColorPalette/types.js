// @flow
export type Props = {
	colors: Array<string>,
	onChange: (colorIndex: number, color: string) => any
};

export type State = {
	colorIndex: number,
	currentColor: string,
	showPalette: boolean
};
