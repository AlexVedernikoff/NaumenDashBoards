// @flow

export type Color = {
	hex: string
};

export type Props = {
	closePicker: () => void,
	currentColor: string,
	onClick: (string: string) => void
};

export type State = {
	itemColor: string,
	presetColors: Array<string>
};
