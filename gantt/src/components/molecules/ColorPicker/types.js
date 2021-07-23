// @flow
import type {Ref} from 'components/types';

export type Color = {
	hex: string
};

export type Props = {
	className: string,
	forwardedRef: Ref<'div'> | null,
	onChange: (color: string) => void,
	onClose: () => void,
	style?: Object,
	value: string
};

export type State = {
	currentColor: string,
	itemColor: string,
	presetColors: Array<string>
};
