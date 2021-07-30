// @flow
import type {CustomGroupAPI} from 'api/interfaces';
import type {CustomGroupData, DashbordParams, Transport} from 'api/types';

export default class CustomGroup implements CustomGroupAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	delete (dashboard: DashbordParams, groupKey: string) {
		return this.transport('dashboardSettings', 'deleteCustomGroup', {...dashboard, groupKey});
	}

	getAll (dashboardId: string) {
		return this.transport('dashboardSettings', 'getCustomGroups', dashboardId);
	}

	getItem (dashboardId: string, groupKey: string) {
		return this.transport('dashboardSettings', 'getCustomGroup', dashboardId, groupKey);
	}

	save (dashboard: DashbordParams, data: CustomGroupData) {
		return this.transport('dashboardSettings', 'saveCustomGroup', {...dashboard, group: data});
	}

	update (dashboard: DashbordParams, data: CustomGroupData) {
		return this.transport('dashboardSettings', 'updateCustomGroup', {...dashboard, group: data});
	}
}
