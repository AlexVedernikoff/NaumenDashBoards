// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {ConnectedFunctions, ConnectedProps} from 'containers/Widget/types';
import type {Ref} from 'components/types';

export type ControlPanelProps = {
	className: string,
	widget: AnyWidget
};

type Components = {
	ControlPanel: React$ComponentType<ControlPanelProps>
};

export type Props = ConnectedFunctions & ConnectedProps & {
	children: React$Node,
	className: string,
	components: Components,
	forwardedRef?: Ref<'div'>,
	widget: AnyWidget
};

export type State = {
	hasError: boolean
};
