// @flow
import type {DivRef} from 'components/types';

export type SetBlurRoot = (value: boolean) => void;

export type InjectedProps = {
	ref: ?DivRef,
	setBlurRoot: SetBlurRoot
};

export type InnerProps = {
	forwardedRef: ?DivRef,
};

export type State = {
	blur: boolean
};
