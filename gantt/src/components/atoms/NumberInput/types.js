// @flow
import type {InputRef, OnChangeEvent} from 'components/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';

export type Components = {
	ContolsContainer: React$ComponentType<ContainerProps>,
};

export type DefaultProps = {|
	className: string,
	disabled: boolean,
	max: ?number,
	min: ?number,
	placeholder: string,
|};

export type Props = {
	...DefaultProps,
	controls: Components,
	forwardedInputRef?: InputRef,
	name: string,
	onChange?: OnChangeEvent<number> => void,
	value: ?number
};
