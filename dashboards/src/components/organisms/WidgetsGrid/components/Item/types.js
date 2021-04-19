// @flow

type GridProps = {
	className?: string,
	onMouseDown?: Function,
	onMouseUp?: Function,
	onTouchEnd?: Function,
	onTouchStart?: Function,
	style?: Object
};

export type Props = GridProps & {
	children: React$Node,
	focused: boolean,
	onFocus: (element: HTMLDivElement) => void,
	selected: boolean
};
