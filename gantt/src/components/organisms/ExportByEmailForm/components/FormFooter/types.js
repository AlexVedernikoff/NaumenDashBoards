// @flow
export type Props = {
	nothingSelected: boolean,
	onReset: () => void,
	onSend: () => Promise<void> | void,
	sending: boolean
};
