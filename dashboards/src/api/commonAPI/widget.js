// @flow
import type {DTOValue, DashbordParams, Transport} from 'api/types';
import type {WidgetAPI} from 'api/interfaces';

export default class Widget implements WidgetAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	checkToCopy (dashboard: DashbordParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'widgetIsBadToCopy', {...dashboard, dashboardKey, widgetKey});
	}

	copyWidget (dashboard: DashbordParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'copyWidgetToDashboard', {...dashboard, dashboardKey, widgetKey});
	}

	create (dashboard: DashbordParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'createWidget', {...dashboard, widget});
	}

	delete (dashboard: DashbordParams, widgetId: string) {
		return this.transport('dashboardSettings', 'deleteWidget', {...dashboard, widgetId});
	}

	edit (dashboard: DashbordParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'editWidget', {...dashboard, widget});
	}

	editChunkData (dashboard: DashbordParams, id: string, widget: DTOValue) {
		return this.transport('dashboardSettings', 'editWidgetChunkData', {...dashboard, id, widget});
	}
}
