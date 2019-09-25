// @flow
export type Props = {
	label: string,
	name: string,
	onBlur: (e: any) => void,
	onReset: (name: string) => void,
	onChange: (e: any) => void,
	placeholder?: string,
	value: any
};
