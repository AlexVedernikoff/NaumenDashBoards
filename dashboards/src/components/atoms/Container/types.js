// @flow
export type Props = {
	children: React$Node,
	className: string,
	onClick?: (event: SyntheticMouseEvent<HTMLDivElement>) => void,
	style?: CSSStyleDeclaration,
	title?: string
};
