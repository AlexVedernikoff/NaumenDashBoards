// @flow
type Event = {
	name: string,
	value: string
};

export type Props = {
	checked: boolean,
	label: string,
	name: string,
	onChange: Event => void,
	value: string
};
