// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DrillDownAPI} from 'api/interfaces';

export default class DrillDown implements DrillDownAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	getLink (payload: DTOValue, subjectUUID: string, type: string, dashboardCode: string, groupCode: string = '') {
		return this.transport(
			'dashboardDrilldown',
			'getLink',
			['requestContent', 'cardObjectUuid', 'diagramTypeFromRequest', 'dashboardKey'],
			payload,
			subjectUUID,
			type,
			dashboardCode,
			groupCode
		);
	}
}
