// @flow

export type Color = {
	hex: string
};

export type Props = {
	onChange: (color: string) => void,
	onClose: () => void,
	value: string
};

export type State = {
	currentColor: string,
	itemColor: string,
	presetColors: Array<string>
};
