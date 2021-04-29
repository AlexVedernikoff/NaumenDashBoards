// @flow
export type Props = {
	className: string,
	label: string,
	name: string,
	onClick: (name: string, value: boolean) => void | Promise<void>,
	renderLabel?: (label: string) => React$Node,
	value: boolean
};
