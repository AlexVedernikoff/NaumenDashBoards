// @flow
import type {ElementRef} from 'react';
import {Widget} from 'components/molecules';

export type State = {
	newWidgetFocused: boolean,
	swipedPanel: boolean,
	width: number | null
};

export type WidgetRef = {
	current: null | ElementRef<typeof Widget>
};
