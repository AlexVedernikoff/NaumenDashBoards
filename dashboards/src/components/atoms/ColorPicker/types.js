// @flow

export type Props = {
	currentColor: string,
	closePicker: () => void,
	handleClick: (string: string) => void
};

export type State = {
	itemColor: string,
	presetColors: Array<string>
};
