// @flow
import type {ElementRef} from 'react';

export type ForwardedRef = {
	current: null | ElementRef<'input'>
};

export type Props = {
	forwardedRef: ForwardedRef,
	maxLength: number | null,
	name: string,
	onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: string | number
};
