// @flow
import type {Position} from 'src/components/molecules/WidgetTooltip/components/Message/types.js';
import type {WidgetTooltip} from 'store/widgets/data/types';

export type Props = {
	position: Position | null,
	text?: string,
	tooltip: WidgetTooltip
};
