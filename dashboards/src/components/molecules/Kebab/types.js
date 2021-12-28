// @flow
export type State = {
	activeKebab: boolean,
	elements: number,
	forceShow: boolean,
	showKebab: boolean,
	width: number
};

export type Props = {
	children: React$Node,
	className: string
};

export type ContextProps = (force: boolean) => void;
