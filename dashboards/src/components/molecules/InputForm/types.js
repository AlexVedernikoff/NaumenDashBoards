// @flow
export type Props = {
	onClose: () => void,
	onSubmit: (value: string) => any,
	rule?: any,
	value: string | number
}

export type Values = {
	value: string
}
