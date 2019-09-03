// @flow
import type {Layout} from 'types/layout';
import type {Widget} from 'entities';

export type Props = {
	widgets: Widget[],
	onLayoutChange?: (layout: Layout) => void
}
