// @flow
import type {Props as ContentProps} from './components/Content/types';
import type {Props as ControlPanelProps} from './components/ControlPanel/types';
import type {Props as WidgetProps} from 'components/organisms/Widget/types';
import type {Widget} from 'store/widgets/data/types';

export type Components = {
	Content: React$ComponentType<ContentProps>,
	ControlPanel: React$ComponentType<ControlPanelProps>,
};

export type Props = {
	...WidgetProps,
	components: Components,
	widget: Widget
};

export type State = {
	nameHeight: number
};
