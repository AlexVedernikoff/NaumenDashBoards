// @flow
import type {ElementRef} from 'react';

export type ForwardedRef = {
	current: null | ElementRef<'input'>
};

export type Props = {
	forwardedRef: ForwardedRef,
	name: string,
	onChange: (name: string, value: string) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: string | number
};
