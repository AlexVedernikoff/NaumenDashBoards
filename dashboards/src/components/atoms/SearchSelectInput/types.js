// @flow
import type {ElementRef} from 'react';

export type ForwardedRef = {
	current: null | ElementRef<'input'>
};

export type Props = {
	forwardedRef: ForwardedRef,
	onChange: (value: string) => void,
	value: string
};
