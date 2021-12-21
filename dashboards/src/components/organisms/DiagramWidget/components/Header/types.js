// @flow
import type {Header, WidgetTooltip} from 'store/widgets/data/types';
import type {Position} from 'src/components/molecules/WidgetTooltip/components/Message/types.js';

export type DefaultProps = {
	className: string
};

export type Props = {
	...DefaultProps,
	onChangeHeight: (height: number) => void,
	settings: Header,
	tooltip: WidgetTooltip,
	widgetName: string
};

export type State = {
	position: Position | null,
};
