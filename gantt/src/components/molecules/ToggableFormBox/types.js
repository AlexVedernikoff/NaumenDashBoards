// @flow
import type {OnChangeEvent} from 'components/types';

export type Props = {
	children: React$Node,
	disabled: boolean,
	message: React$Node,
	name: string,
	onToggle?: (event: OnChangeEvent<boolean>) => void,
	showContent: boolean,
	title: string,
};
