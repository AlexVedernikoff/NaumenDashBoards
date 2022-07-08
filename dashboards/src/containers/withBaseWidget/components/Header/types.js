// @flow
import type {Header, WidgetTooltip} from 'store/widgets/data/types';

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
