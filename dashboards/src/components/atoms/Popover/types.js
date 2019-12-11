// @flow
import type {Node} from 'react';
import {POSITIONS} from './constants';

type Position =
	| typeof POSITIONS.RIGHT
;

export type Props = {
	children: Node,
	position: Position,
	renderContent?: () => Node,
	text: string
}
