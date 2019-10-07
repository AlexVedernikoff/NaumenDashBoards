// @flow
import type {Node} from 'react';

export type State = {
	currentTab: number,
}

export type TabParams = {
	title: string,
	component: Node,
	key: number
}
