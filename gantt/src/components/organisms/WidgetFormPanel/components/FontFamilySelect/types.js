// @flow
import type {OnSelectEvent} from 'components/types';

export type Props = {
	className: string,
	name: string,
	onSelect: (event: OnSelectEvent) => void,
	options: Array<string>,
	value: string
};
