// @flow
import type {CustomGroupAPI} from 'api/interfaces';
import type {CustomGroupData, DashbordParams, Transport} from 'api/types';

export default class CustomGroup implements CustomGroupAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	delete (dashboard: DashbordParams, groupKey: string) {
		return this.transport('dashboardSettings', 'deleteCustomGroup', ['requestContent'], {...dashboard, groupKey});
	}

	getAll (dashboardKey: string) {
		return this.transport('dashboardSettings', 'getCustomGroups', ['requestContent'], {dashboardKey});
	}

	getItem (dashboardKey: string, customGroupKey: string) {
		return this.transport('dashboardSettings', 'getCustomGroup', ['requestContent'], {customGroupKey, dashboardKey});
	}

	save (dashboard: DashbordParams, data: CustomGroupData) {
		return this.transport('dashboardSettings', 'saveCustomGroup', ['requestContent'], {...dashboard, group: data});
	}

	update (dashboard: DashbordParams, data: CustomGroupData) {
		return this.transport('dashboardSettings', 'updateCustomGroup', ['requestContent'], {...dashboard, group: data});
	}
}
