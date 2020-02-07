// @flow
export type Props = {
	name: string,
	onCancel: (name: string) => void,
	onSubmit: (name: string, value: string) => void,
	value: string | null
};

export type State = {
	showForm: boolean,
	value: string
};
