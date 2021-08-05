// @flow
import type {DTOValue, DashbordParams, Transport} from 'api/types';
import type {WidgetAPI} from 'api/interfaces';

export default class Widget implements WidgetAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	checkToCopy (dashboard: DashbordParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'widgetIsBadToCopy', ['requestContent'], {...dashboard, dashboardKey, widgetKey});
	}

	copyWidget (dashboard: DashbordParams, dashboardKey: string, widgetKey: string) {
		return this.transport('dashboardSettings', 'copyWidgetToDashboard', ['requestContent'], {...dashboard, dashboardKey, widgetKey});
	}

	create (dashboard: DashbordParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'createWidget', ['requestContent'], {...dashboard, widget});
	}

	delete (dashboard: DashbordParams, widgetId: string) {
		return this.transport('dashboardSettings', 'deleteWidget', ['requestContent'], {...dashboard, widgetId});
	}

	edit (dashboard: DashbordParams, widget: DTOValue) {
		return this.transport('dashboardSettings', 'editWidget', ['requestContent'], {...dashboard, widget});
	}

	editChunkData (dashboard: DashbordParams, id: string, chunkData: DTOValue) {
		return this.transport('dashboardSettings', 'editWidgetChunkData', ['requestContent'], {...dashboard, chunkData, id});
	}
}
