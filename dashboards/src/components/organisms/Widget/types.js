// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {Ref} from 'components/types';
import type {ThunkAction} from 'store/types';

export type ControlPanelProps = {
	className: string,
	widget: AnyWidget
};

type Components = {
	ControlPanel: React$ComponentType<ControlPanelProps>
};

export type Props = {
	children: React$Node,
	className: string,
	clearWarningMessage: (widgetId: string) => ThunkAction,
	components: Components,
	forwardedRef?: Ref<'div'>,
	widget: AnyWidget
};

export type State = {
	hasError: boolean
};
