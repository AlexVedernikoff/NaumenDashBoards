// @flow
import type {ElementRef} from 'react';

export type ForwardedRef = {
	current: null | ElementRef<'input'>
};

export type DefaultProps = {|
	className: string,
	forwardedRef: ForwardedRef,
	value: string
|};

export type RequiredProps = {
	onChange: (value: string) => void,
	onFocus?: (e: SyntheticInputEvent<HTMLInputElement>) => void
};

export type Props = {
	...RequiredProps,
	...DefaultProps
};

export type ComponentProps = React$Config<Props, DefaultProps>;

export type State = {
	value: string
};
