// @flow
export type Props = {
	className: string,
	onClose: () => void,
	onSubmit: (value: string) => any,
	value: string | number
};

export type State = {
	value: string
};
