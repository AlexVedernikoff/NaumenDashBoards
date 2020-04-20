// @flow
import type {OnChangeInputEvent} from 'components/types';

export type Props = {
	className: string,
	container: HTMLElement | null,
	name: string,
	onChange: OnChangeInputEvent => void,
	portable: boolean,
	value: string
};

export type State = {
	showPicker: boolean
};
