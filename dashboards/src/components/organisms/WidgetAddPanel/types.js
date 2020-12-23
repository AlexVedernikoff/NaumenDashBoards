// @flow

type InvalidCopyData = {
	dashboardId: string,
	widgetId: string
};

export type State = {
	invalidCopyData: InvalidCopyData | null
};
