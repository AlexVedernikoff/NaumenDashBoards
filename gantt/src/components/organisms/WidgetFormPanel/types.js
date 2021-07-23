// @flow
import type {Props as ContainerProps} from 'containers/WidgetFormPanel/types';
import type {WidgetType} from 'store/widgets/data/types';

export type Props = ContainerProps;

export type State = {
	initialized: boolean,
	type: WidgetType
};
