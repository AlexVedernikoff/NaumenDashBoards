// @flow
import type {OnChangeInputEvent} from 'components/types';

export type Props = {
	children: React$Node,
	name: string,
	onToggle?: (event: OnChangeInputEvent) => void,
	showContent: boolean,
	title: string
};
