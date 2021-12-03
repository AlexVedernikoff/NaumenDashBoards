// @flow
import type {DTOValue, DashboardParams, Transport} from 'api/types';
import type {WidgetAPI} from 'api/interfaces';

export default class Widget implements WidgetAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	checkToCopy (dashboard: DashboardParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'widgetIsBadToCopy', ['requestContent'], {...dashboard, dashboardKey, widgetKey});
	}

	copyWidget (dashboard: DashboardParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'copyWidgetToDashboard', ['requestContent'], {...dashboard, dashboardKey, widgetKey});
	}

	create (dashboard: DashboardParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'createWidget', ['requestContent'], {...dashboard, widget});
	}

	delete (dashboard: DashboardParams, widgetId: string) {
		return this.transport('dashboardSettings', 'deleteWidget', ['requestContent'], {...dashboard, widgetId});
	}

	edit (dashboard: DashboardParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'editWidget', ['requestContent'], {...dashboard, widget});
	}

	editChunkData (dashboard: DashboardParams, id: string, chunkData: DTOValue) {
		return this.transport('dashboardSettings', 'editWidgetChunkData', ['requestContent'], {...dashboard, chunkData, id});
	}
}
