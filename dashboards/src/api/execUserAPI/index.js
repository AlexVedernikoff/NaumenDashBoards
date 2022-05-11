// @flow
import type {DTOValue, Transport} from 'api/types';
import DashboardSettings from 'api/commonAPI/dashboardSettings';
import Dashboards from 'api/commonAPI/dashboards';
import ExecAPI from 'api/execAPI';
import type {FrameAPI} from 'api/interfaces';
import Settings from 'api/commonAPI/settings';

class UserSettings extends Settings {
	getSettings (payload: DTOValue) {
		return this.transport('dashboardSettings', 'getSettings', ['requestContent'], payload);
	}
}

class UserDashboardSettings extends DashboardSettings {
	constructor (transport: Transport) {
		super(transport);
		this.settings = new UserSettings(this.transport);
	}
}

class UserDashboards extends Dashboards {
	getDataSources (dashboardUUID: string) {
		return this.transport('dashboards', 'getDataSourcesForUser', ['dashboardUUID', 'user'], dashboardUUID);
	}

	getDataSourceAttributes (params: DTOValue) {
		return this.transport('dashboards', 'getDataSourceAttributesByGroupCode', ['requestContent'], params);
	}

	getDynamicAttributeGroups (descriptor: DTOValue) {
		return this.transport('dashboards', 'getDynamicAttributeGroupsForUser', ['requestContent'], {descriptor});
	}
}

export default class ExecUserAPI extends ExecAPI {
	constructor (transport: ?Transport = null, frame: ?FrameAPI = null) {
		super(transport, frame);
		this.dashboards = new UserDashboards(this.transport);
		this.dashboardSettings = new UserDashboardSettings(this.transport);
	}
}
