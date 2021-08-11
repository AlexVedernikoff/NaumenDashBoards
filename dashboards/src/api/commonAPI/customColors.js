// @flow

import type {ColorsSettingsDTO, DashbordParams, Transport} from 'api/types';
import type {CustomColorsAPI} from 'api/interfaces';

export default class CustomColors implements CustomColorsAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	delete (dashboard: DashbordParams, customColorKey: string) {
		return this.transport('dashboardSettings', 'deleteCustomColors', ['requestContent'], {...dashboard, key: customColorKey});
	}

	save (dashboard: DashbordParams, colorsSettings: ColorsSettingsDTO) {
		return this.transport('dashboardSettings', 'saveCustomColors', ['requestContent'], {...dashboard, colorsSettings});
	}
}
