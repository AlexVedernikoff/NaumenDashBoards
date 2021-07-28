// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {ConnectedFunctions, ConnectedProps} from 'containers/WidgetControlPanel/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';

export type Components = {
	Container: React$ComponentType<ContainerProps>,
	DropdownMenu: React$ComponentType<{
		children: React$Node
	}>,
	FilterOnWidget: React$ComponentType<{}>
};

export type DefaultProps = {
	components: Components
};

export type Props = ConnectedProps & ConnectedFunctions & {
	...DefaultProps,
	className: string,
	widget: AnyWidget,
};

export type State = {
	showRemoveModal: boolean,
	showSubmenu: boolean
};
