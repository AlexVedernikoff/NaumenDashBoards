// @flow
import type {CopyWidgetError} from 'store/widgets/data/types';

type InvalidCopyData = {
	dashboardId: string,
	reasons: Array<CopyWidgetError>,
	widgetId: string
};

export type State = {
	invalidCopyData: InvalidCopyData | null
};
