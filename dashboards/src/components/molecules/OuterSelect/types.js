// @flow
import type {Element} from 'react';

export type Option = {
	label: string | Element<'svg'>,
	tip: string,
	value: string
};

export type Props = {
	name: string,
	onSelect: (name: string, value: string) => any,
	options: Array<Option>,
	value: string
};
