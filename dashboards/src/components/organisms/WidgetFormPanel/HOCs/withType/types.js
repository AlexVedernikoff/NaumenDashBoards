// @flow
export type Context = {
	onChange: (type: string) => void,
	value: string
};

export type InjectedProps = {
	type: Context
};

export type Props = Object;
