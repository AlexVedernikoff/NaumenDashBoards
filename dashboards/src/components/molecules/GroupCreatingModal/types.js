// @flow
import type {AttrModalProps, Props as ContainerProps} from 'containers/GroupCreatingModal/types';
import type {GroupWay} from 'store/widgets/data/types';

export type Props = {|
	...AttrModalProps,
	...ContainerProps
|};

export type State = {
	attributeTitle: string,
	way: GroupWay
};

export type SetSubmit = (submit: Function) => void;
