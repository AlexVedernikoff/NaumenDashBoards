// @flow
import type {DiagramMap} from 'store/widgets/diagrams/types';
import type {ElementRef} from 'react';
import type {Layout} from 'utils/layout/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type State = {
	width: number | null
};

export type Props = {
	diagrams: DiagramMap,
	isEditable: boolean,
	onLayoutChange?: (layout: Layout) => void,
	onSelectWidget?: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
	widgets: WidgetMap
};

export type ContainerRef = {
	current: null | ElementRef<'div'>
};
