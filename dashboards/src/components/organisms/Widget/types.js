// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import type {ConnectedFunctions, ConnectedProps} from 'containers/Widget/types';
import type {Ref} from 'components/types';

export type WidgetKebabProps = {
	className: string,
	widget: AnyWidget
};

type Components = {
	WidgetKebab: React$ComponentType<WidgetKebabProps>
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
