// @flow
import type {AttrModalProps, Props as ContainerProps} from 'containers/GroupCreatingModal/types';
import type {Attribute} from 'store/sources/attributes/types';
import type {GroupWay} from 'store/widgets/data/types';

export type Props = {|
	...AttrModalProps,
	...ContainerProps
|};

export type State = {
	attribute: Attribute,
	way: GroupWay
};

export type SetSubmit = (submit: Function) => void;
