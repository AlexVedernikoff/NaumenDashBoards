// @flow
import type {Layout} from 'types/layout';
import type {Widget} from 'entities';

export type Props = {
	onLayoutChange?: (layout: Layout) => void,
	openWidgetPanel: (id: string) => void,
	widgets: Widget[]
};
