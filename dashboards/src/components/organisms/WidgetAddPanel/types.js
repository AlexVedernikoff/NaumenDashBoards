// @flow

import {COPY_WIDGET_ERRORS} from './constants';

type CopyWidgetError = $Values<typeof COPY_WIDGET_ERRORS>;

type InvalidCopyData = {
	dashboardId: string,
	reasons: Array<CopyWidgetError>,
	widgetId: string
};

export type State = {
	invalidCopyData: InvalidCopyData | null
};
