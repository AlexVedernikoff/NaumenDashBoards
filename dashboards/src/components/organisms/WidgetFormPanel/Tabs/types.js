// @flow
import type {Node} from 'react';

export type State = {
	currentTab: number,
}

export type TabParams = {
	component: Node,
	key: number,
	title: string
}
