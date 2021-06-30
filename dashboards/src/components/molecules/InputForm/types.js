// @flow
import type {InputRef} from 'components/types';
export type Props = {
	className: string,
	forwardedRef?: InputRef,
	onClose: () => void,
	onSubmit: (value: string) => any,
	value: string | number
};

export type State = {
	value: string
};
