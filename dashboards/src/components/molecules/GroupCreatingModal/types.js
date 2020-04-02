// @flow
import type {AttrCustomProps} from './components/CustomGroup/types';
import type {AttrSystemProps} from './components/SystemGroup/types';
import {CustomGroup, SystemGroup} from './components';
import type {ElementRef} from 'react';
import type {GroupWay} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'containers/GroupCreatingModal/types';

export type CustomGroupRef = {
	current: null | ElementRef<typeof CustomGroup>
};

export type SystemGroupRef = {
	current: null | ElementRef<typeof SystemGroup>
};

type ModalProps = {|
	attrCustomProps: AttrCustomProps,
	attrSystemProps: AttrSystemProps,
|};

export type Props = {|
	...ModalProps,
	...ContainerProps
|};

export type State = {
	attributeTitle: string,
	way: GroupWay
};
