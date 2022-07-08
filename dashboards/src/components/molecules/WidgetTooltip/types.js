// @flow
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {WidgetTooltip} from 'store/widgets/data/types';

export type Components = {
	Icon: React$ComponentType<ContainerProps>,
	Modal: React$ComponentType<ContainerProps>,
	ModalBody: React$ComponentType<ContainerProps>,
	ModalHeader: React$ComponentType<ContainerProps>,
};

export type Props = {
	className: string,
	components: ?$Shape<Components>,
	text?: string,
	tooltip: WidgetTooltip
};

export type State = {
	showModal: boolean,
};
