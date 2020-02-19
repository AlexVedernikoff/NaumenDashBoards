// @flow
type Option = Object;

export type Props = {
	getOptionLabel?: Option => string,
	found: boolean,
	onClick: (Option | null) => void,
	option: Option,
	selected: boolean
};
