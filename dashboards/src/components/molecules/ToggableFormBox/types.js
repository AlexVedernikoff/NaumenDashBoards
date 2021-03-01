// @flow
import type {OnChangeEvent} from 'components/types';

export type Props = {
	children: React$Node,
	name: string,
	onToggle?: (event: OnChangeEvent<boolean>) => void,
	showContent: boolean,
	title: string
};
