// @flow

export type DefaultProps = {
	className: string,
	disabled: boolean,
	isTitle: boolean,
	reverse: boolean,
	small: boolean,
	tip: string
};

export type Props = DefaultProps & {
	children: React$Node,
	label: string,
	onClickLabel?: () => void,
};
