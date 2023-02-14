// @flow
import type {Ref} from 'components/atoms/types';
export type Props = {
	children: React$Node,
	className: string,
	forwardedRef?: Ref,
	onClick?: (event: SyntheticMouseEvent<HTMLDivElement>) => void,
	style?: CSSStyleDeclaration,
	title?: string
};
