// @flow
import type {DTOValue, Transport} from 'api/types';
import type {PersonalDashboardAPI} from 'api/interfaces';

export default class PersonalDashboardCommon implements PersonalDashboardAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	create (classFqn: string, contentCode: string, editable: boolean) {
		return this.transport('dashboardSettings', 'createPersonalDashboard', ['requestContent'], {classFqn, contentCode, editable});
	}

	delete (classFqn: string, contentCode: string): Promise<DTOValue> {
		return this.transport('dashboardSettings', 'deletePersonalDashboard', ['classFqn', 'contentCode'], classFqn, contentCode);
	}
}
