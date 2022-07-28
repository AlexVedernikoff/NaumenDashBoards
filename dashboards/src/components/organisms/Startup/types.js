// @flow
export type SetBlurRoot = (value: boolean) => void;

export type InjectedProps = {
	setBlurRoot: SetBlurRoot
};

export type State = {
	blur: boolean
};
