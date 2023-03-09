// @flow
import type {SessionWidgetPart, Widget} from 'store/widgets/data/types';

export type Props = {
	updateWidget: (widget: SessionWidgetPart) => void,
	widget: Widget,
};
