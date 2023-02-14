// @flow
import type {Ref} from 'components/atoms/types';

export type DefaultProps = {|
	className: string,
	focusOnMount: boolean,
	forwardedRef: Ref<'input'> | null,
	value: string
|};

export type RequiredProps = {
	onChange: (value: string) => void,
	onFocus: (e: SyntheticInputEvent<HTMLInputElement>) => void
};

export type Props = {
	...RequiredProps,
	...DefaultProps
};

export type State = {
	value: string
};
