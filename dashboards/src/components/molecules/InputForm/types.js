// @flow
export type Props = {
	onClose: () => void,
	onSubmit: (value: string) => any,
	value: string | number
};

export type State = {
	value: string
};
