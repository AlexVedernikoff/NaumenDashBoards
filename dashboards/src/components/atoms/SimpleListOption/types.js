// @flow
type Option = Object;

export type Props = {
	found: boolean,
	getOptionLabel?: Option => string,
	onClick: (Option | null) => void,
	option: Option,
	selected: boolean
};
