// @flow
import type {DivRef} from 'components/types';
export type Props = {
	children: React$Node,
	className: string,
	forwardedRef?: DivRef,
	onClick?: (event: SyntheticMouseEvent<HTMLDivElement>) => void,
	style?: CSSStyleDeclaration,
	title?: string
};
