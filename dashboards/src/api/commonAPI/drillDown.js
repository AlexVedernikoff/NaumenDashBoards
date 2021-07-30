// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DrillDownAPI} from 'api/interfaces';

export default class DrillDown implements DrillDownAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	getLink (payload: DTOValue, subjectUUID: string, type: string, dashboardCode: string) {
		return this.transport(
			'dashboardDrilldown',
			'getLink',
			payload,
			subjectUUID,
			type,
			dashboardCode
		);
	}
}
