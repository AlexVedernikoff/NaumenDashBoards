// @flow
export type Props = {
	name: string,
	onChange: (name: string, value: string) => void,
	onlyNumber: boolean,
	placeholder: string,
	value: string | number
}
