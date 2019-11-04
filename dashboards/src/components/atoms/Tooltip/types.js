// @flow
import type {Node} from 'react';

export type TooltipElementProps = {
	[string]: any
};

export type Props = {
	children: Node,
	hideArrow: boolean,
	placement: string,
	tooltip: Node | string
}
