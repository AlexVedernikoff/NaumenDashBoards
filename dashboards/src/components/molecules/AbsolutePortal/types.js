// @flow
export type Props = {
	children: React$Node,
	container: HTMLElement | null,
	elem: HTMLElement
};

export type State = {
	height: number,
	left: number,
	top: number,
	width: number
};
