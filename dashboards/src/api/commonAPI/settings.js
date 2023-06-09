// @flow
import type {DTOValue, Transport} from 'api/types';
import type {SettingsDataAPI} from 'api/interfaces';

export default class Settings implements SettingsDataAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	editLayouts (payload: DTOValue) {
		return this.transport('dashboardSettings', 'editLayouts', ['requestContent'], payload);
	}

	getDashboardsAndWidgetsTree () {
		return this.transport('dashboardSettings', 'getDashboardsAndWidgetsTree', []);
	}

	getSettings (payload: DTOValue) {
		return this.transport('dashboardSettings', 'getSettings', ['requestContent'], payload);
	}

	getUserData (payload: DTOValue) {
		return this.transport('dashboardSettings', 'getUserData', ['requestContent'], payload);
	}

	getUsers () {
		return this.transport('dashboardSettings', 'getUsers', []);
	}

	saveAutoUpdate (payload: DTOValue) {
		return this.transport('dashboardSettings', 'saveAutoUpdateSettings', ['requestContent'], payload);
	}
}
