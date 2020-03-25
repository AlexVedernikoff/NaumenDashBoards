// @flow
export type Props = {
	name: string,
	onBlur?: (e: any) => void,
	onChange: (e: any) => void,
	onReset: (name: string) => void,
	placeholder?: string,
	value: any
};
