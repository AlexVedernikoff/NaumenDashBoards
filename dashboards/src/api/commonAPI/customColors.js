// @flow

import type {ColorsSettingsDTO, DashboardParams, Transport} from 'api/types';
import type {CustomColorsAPI} from 'api/interfaces';

export default class CustomColors implements CustomColorsAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	delete (dashboard: DashboardParams, customColorKey: string) {
		return this.transport('dashboardSettings', 'deleteCustomColors', ['requestContent'], {...dashboard, key: customColorKey});
	}

	save (dashboard: DashboardParams, colorsSettings: ColorsSettingsDTO) {
		return this.transport('dashboardSettings', 'saveCustomColors', ['requestContent'], {...dashboard, colorsSettings});
	}
}
