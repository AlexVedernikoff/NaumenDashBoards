// @flow
import type {WidgetTooltip} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: WidgetTooltip) => void,
	value: WidgetTooltip
};
